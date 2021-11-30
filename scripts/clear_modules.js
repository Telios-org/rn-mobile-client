#!/usr/bin/env node
const { rm, readdir } = require('fs').promises
const { join } = require('path')

const { MODULE_FOLDER } = require('./constants')

const SODIUM_NATIVE_FOLDER = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  console.log('Deleting unnecessary modules and build-specific files')
  const TO_PRESERVE = [
    'sodium-native-nodejs-mobile',
    'utp-native-nodejs-mobile',
    'sodium-native',
    'utp-native',
    'sequelize',
    'fd-lock',
    'leveldown',
    'nodemailer',
    'fsctl',
    'sqlite3',
    'crc32-universal',
    '@journeyapps'
  ]

  const moduleNames = await readdir(MODULE_FOLDER)
  const nonEssentialModules = moduleNames.filter((name) => !TO_PRESERVE.includes(name))

  const toDelete = [
    join(SODIUM_NATIVE_FOLDER, 'libsodium'),
    join(SODIUM_NATIVE_FOLDER, 'lib'),
    ...nonEssentialModules.map((name) => join(MODULE_FOLDER, name))
  ]

  for (const folder of toDelete) {
    await rm(folder, {
      recursive: true,
      force: true
    })
  }
}
