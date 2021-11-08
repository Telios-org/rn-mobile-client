const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)
const { join } = require('path')
const {
  readFile,
  writeFile,
  copyFile,
  mkdir,
  readdir,
  rm
} = require('fs/promises')

const IOS = 'ios'
const ANDROID = 'android'

let platform = (process.platform === 'darwin') ? IOS : ANDROID
if (process.argv.includes('--android')) { platform = ANDROID }
if (process.argv.includes('--ios')) { platform = IOS }

let isSimulator = false
isSimulator = process.argv.includes('--simulator')

const ANDROID_DIR = join(__dirname, 'android')
const IOS_DIR = join(__dirname, 'ios')
const PROJECT_DIR = join(__dirname, 'nodejs-assets/nodejs-project/')
const NODEJS_MOBILE_DIR = join(__dirname, 'node_modules/nodejs-mobile-react-native')
const MODULE_FOLDER = join(PROJECT_DIR, 'node_modules')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  console.log('Building for platform:', platform)
  await patch()
  await build()
  console.log('Finished!🎉')
}

async function patch () {
  if (platform === ANDROID) {
    console.log('Patching nodejs-mobile gradle script')
    const NODEJS_MOBILE_GRADLE = join(NODEJS_MOBILE_DIR, 'android/build.gradle')
    const mainSectionMatch = / {8}main {[^}]+}/gm
    const existingGradle = await readFile(NODEJS_MOBILE_GRADLE, 'utf8')
    const patchedGradle = existingGradle.replace(mainSectionMatch, '')
    await writeFile(NODEJS_MOBILE_GRADLE, patchedGradle)
  }

  console.log('Patching nodejs-mobile EventEmitter import')
  const toReplaceRequire = 'var EventEmitter = require(\'react-native/Libraries/vendor/emitter/EventEmitter\');'
  const replaceWithImport = 'import EventEmitter from \'react-native/Libraries/vendor/emitter/EventEmitter\';'

  const NODEJS_MOBILE_INDEX = join(NODEJS_MOBILE_DIR, 'index.js')
  const indexContent = await readFile(NODEJS_MOBILE_INDEX, 'utf8')
  const patchedIndex = indexContent.replace(toReplaceRequire, replaceWithImport)
  await writeFile(NODEJS_MOBILE_INDEX, patchedIndex)
}

async function build () {
  // - Delete sodium-native-nodejs-mobile if it exists
  console.log('Clearing sodium-native-nodejs-mobile state')
  const SODIUM_NATIVE_FOLDER = join(PROJECT_DIR, 'node_modules/sodium-native-nodejs-mobile/')
  await rm(SODIUM_NATIVE_FOLDER, { recursive: true, force: true })

  // - Run install inside of `nodejs-assets/nodejs-project`
  console.log('Installing nodejs-project dependencies')
  const env = (platform === IOS)
    ? makeEnv({
        PLATFORM_NAME: isSimulator ? 'iphonesimulator' : 'iphoneos'
      })
    : makeEnv({})
  await exec('npm install --no-optional', {
    cwd: PROJECT_DIR,
    env
  })

  console.log('Deleting .bin dir to fix builds')
  const BIN_DIR = join(PROJECT_DIR, 'node_modules/.bin')
  await rm(BIN_DIR, { recursive: true, force: true })

  const SODIUM_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/sodium-native')
  console.log('Clearing existing sodium-native package')
  await rm(SODIUM_NATIVE_DIR, { recursive: true, force: true })

  console.log('Creating fake sodium-native package')
  await mkdir(SODIUM_NATIVE_DIR, { recursive: true, force: true })
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'package.json'),
    JSON.stringify({
      name: 'sodium-native',
      main: 'index.js',
      // Technically the version is 3.2.0, but that is just a change to builds, not API
      version: '3.3.0'
    })
  )
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'index.js'),
    'module.exports = require(\'sodium-native-nodejs-mobile\')\n'
  )

  const UTP_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/utp-native')
  console.log('Clearing existing utp-native package')
  await rm(UTP_NATIVE_DIR, { recursive: true, force: true })

  console.log('Creating fake utp-native package')
  await mkdir(UTP_NATIVE_DIR, { recursive: true, force: true })
  await writeFile(
    join(UTP_NATIVE_DIR, 'package.json'),
    JSON.stringify({ name: 'utp-native', main: 'index.js', version: '2.1.4' })
  )
  await writeFile(
    join(UTP_NATIVE_DIR, 'index.js'),
    'module.exports = require(\'utp-native-nodejs-mobile\')\n'
  )

  console.log('Deleting duplicate sodium-native modules')

  // TODO: Cleaner approach?
  const DUPLICATE_SODIUM_FOLDERS = [
    'sodium-universal/node_modules/sodium-native',
    '@telios/nebula-drive/node_modules/sodium-native',
    'hmac-blake2b/node_modules/sodium-native',
    'blake2b-universal/node_modules/sodium-native',
    'xsalsa20-universal/node_modules/sodium-native',
    'noise-curve-ed/node_modules/sodium-native',
    'hypercore-peer-auth/node_modules/sodium-native'
  ]

  for (const folder of DUPLICATE_SODIUM_FOLDERS) {
    await rm(join(MODULE_FOLDER, folder), { recursive: true, force: true })
  }

  console.log('Patch imports for sodium and utp mobile')
  const SODIUM_INDEX = join(SODIUM_NATIVE_FOLDER, 'index.js')
  await writeFile(SODIUM_INDEX, `
var path = require('path')
var requirePath = path.join(__dirname, 'build/Release/sodium.node')
var sodium = require(requirePath)

module.exports = sodium;
`)

  const UTP_BINDING = join(PROJECT_DIR, 'node_modules/utp-native-nodejs-mobile/lib/binding.js')
  await writeFile(UTP_BINDING, `
var path = require('path')
var requirePath = path.resolve(__dirname, '../build/Release/sodium.node')
module.exports = require(requirePath)
`)

  if (platform === ANDROID) {
  // - Run `NODEJS_MOBILE_BUILD_NATIVE_MODULES=1 ./gradlew buildRelease
    console.log('Running build for native modules')
    console.log('(This can take a while)')
    await exec('./gradlew buildRelease', {
      cwd: ANDROID_DIR,
      env: makeEnv({ NODEJS_MOBILE_BUILD_NATIVE_MODULES: '1' })
    })

    // - Copy over sodium files into `android/app/src/main/`
    console.log('Copying native files to android jni')
    const SODIUM_LIBS = join(SODIUM_NATIVE_FOLDER, 'lib/')
    const JNI_FOLDER = join(ANDROID_DIR, 'app/src/main/jniLibs/')

    // Map from nodejs folder name to Android folder name
    const ABI_FOLDER_MAP = {
      'android-arm': 'armeabi-v7a',
      'android-arm64': 'arm64-v8a'
    }

    const SODIUM_LIB_FILE = 'libsodium.so'

    for (const [nodeName, androidName] of Object.entries(ABI_FOLDER_MAP)) {
      const nodeFolder = join(SODIUM_LIBS, nodeName)
      const androidFolder = join(JNI_FOLDER, androidName)
      await mkdir(androidFolder, { recursive: true })
      await copyFile(
        join(nodeFolder, SODIUM_LIB_FILE),
        join(androidFolder, SODIUM_LIB_FILE)
      )
    }
  } else if (platform === IOS) {
    console.log('Building native files for iOS')
    await exec('xcodebuild -scheme TeliosMobile -workspace TeliosMobile.xcworkspace -quiet build', {
      cwd: IOS_DIR,
      env: makeEnv({ NODEJS_MOBILE_BUILD_NATIVE_MODULES: '1' })
    })
  }

  console.log('Build JS bundle with browserify')
  await exec('npm run bundle-node')

  console.log('Deleting unnecessary modules and build-specific files')
  const TO_PRESERVE = [
    'sodium-native-nodejs-mobile',
    'utp-native-nodejs-mobile',
    'sodium-native',
    'utp-native'
  ]

  const moduleNames = await readdir(MODULE_FOLDER)
  const nonEssentialModules = moduleNames.filter((name) => !TO_PRESERVE.includes(name))

  const toDelete = [
    join(SODIUM_NATIVE_FOLDER, 'libsodium'),
    join(SODIUM_NATIVE_FOLDER, 'lib'),
    ...nonEssentialModules.map((name) => join(MODULE_FOLDER, name))
  ]

  // Android has different architectures, so we should delete the default build folder
  if (platform === ANDROID) {
    toDelete.unshift(join(SODIUM_NATIVE_FOLDER, 'build'))
  }

  for (const folder of toDelete) {
    await rm(folder, {
      recursive: true,
      force: true
    })
  }
  if (platform === ANDROID) {
    console.log('Clean gradle')
    await exec('./gradlew clean', {
      cwd: ANDROID_DIR,
      env: makeEnv({ NODEJS_MOBILE_BUILD_NATIVE_MODULES: '0' })
    })

    // - Run `NODEJS_MOBILE_BUILD_NATIVE_MODULES=0 ./gradlew buildRelease
    console.log('Running release build without native module rebuild')
    const shouldInstall = process.argv.includes('--install')
    if (shouldInstall) console.log('Will also install on device')
    console.log('(This can take a while)')
    const gradlewCommand = shouldInstall ? 'installRelease' : 'buildRelease'
    await exec(`./gradlew ${gradlewCommand}`, {
      cwd: ANDROID_DIR,
      env: makeEnv({ NODEJS_MOBILE_BUILD_NATIVE_MODULES: '0' })
    })
  } else if (platform === IOS) {
  // TODO: Support `--install` flag for iOS
    console.log('Runnin release build without native module rebuild')
    await exec('xcodebuild -scheme TeliosMobile -workspace TeliosMobile.xcworkspace -quiet build', {
      cwd: IOS_DIR,
      env: makeEnv({ NODEJS_MOBILE_BUILD_NATIVE_MODULES: '0' })
    })
  }
}

function makeEnv (vars = {}) {
  return { ...process.env, ...vars }
}
