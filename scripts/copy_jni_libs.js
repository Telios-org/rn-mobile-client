#!/usr/bin/env node
const { mkdir, copyFile } = require('fs').promises
const { join } = require('path')

const { MODULE_FOLDER, ANDROID_DIR } = require('./constants')

const SODIUM_NATIVE_FOLDER = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
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
}
