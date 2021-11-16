#!/usr/bin/env node
const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

const { PROJECT_DIR } = require('./constants')

const IOS = 'ios'
const ANDROID = 'android'

let platform = (process.platform === 'darwin') ? IOS : ANDROID
if (process.argv.includes('--android')) { platform = ANDROID }
if (process.argv.includes('--ios')) { platform = IOS }

let isSimulator = false
isSimulator = process.argv.includes('--simulator')

const PLATFORM_NAME = ((platform === IOS) && !isSimulator) ? 'iphoneos' : ''

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
// - Run install inside of `nodejs-assets/nodejs-project`
  console.log('Installing nodejs-project dependencies')
  const env = (platform === IOS)
    ? makeEnv({
        PLATFORM_NAME
      })
    : makeEnv({})
  await exec('npm install --no-optional', {
    cwd: PROJECT_DIR,
    env
  })
}

function makeEnv (vars = {}) {
  return { ...process.env, ...vars }
}
