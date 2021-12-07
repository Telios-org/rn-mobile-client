#!/usr/bin/env node
const { readFile, writeFile } = require('fs').promises
const { join } = require('path')

const {
  NODEJS_MOBILE_DIR
} = require('./constants')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  console.log('Patching nodejs-mobile gradle script')
  const NODEJS_MOBILE_GRADLE = join(NODEJS_MOBILE_DIR, 'android/build.gradle')
  const mainSectionMatch = / {8}main {[^}]+}/gm
  const existingGradle = await readFile(NODEJS_MOBILE_GRADLE, 'utf8')
  const patchedGradle = existingGradle.replace(mainSectionMatch, '')
  await writeFile(NODEJS_MOBILE_GRADLE, patchedGradle)

  console.log('Patching nodejs-mobile EventEmitter import')
  const toReplaceRequire = 'var EventEmitter = require(\'react-native/Libraries/vendor/emitter/EventEmitter\');'
  const replaceWithImport = 'import EventEmitter from \'react-native/Libraries/vendor/emitter/EventEmitter\';'

  const NODEJS_MOBILE_INDEX = join(NODEJS_MOBILE_DIR, 'index.js')
  const indexContent = await readFile(NODEJS_MOBILE_INDEX, 'utf8')
  const patchedIndex = indexContent.replace(toReplaceRequire, replaceWithImport)
  await writeFile(NODEJS_MOBILE_INDEX, patchedIndex)
}
