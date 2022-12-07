#!/usr/bin/env node
const { rmdir, readdir } = require('fs').promises;
const { join } = require('path');

const { MODULE_FOLDER } = require('./constants');

const SODIUM_NATIVE_FOLDER = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile');

run().catch(e => {
  process.nextTick(() => {
    throw e;
  });
});

async function run() {
  console.log('Deleting unnecessary modules and build-specific files');
  const TO_PRESERVE = [
    'sodium-native-nodejs-mobile',
    'udx-native-nodejs-mobile',
    'sodium-native',
    'udx-native',
    'fd-lock',
    'leveldown',
    'nodemailer',
    'fsctl',
    'crc32-universal'
  ];

  const moduleNames = await readdir(MODULE_FOLDER);
  const nonEssentialModules = moduleNames.filter(
    name => !TO_PRESERVE.includes(name),
  );

  const toDelete = [
    join(SODIUM_NATIVE_FOLDER, 'libsodium'),
    join(SODIUM_NATIVE_FOLDER, 'lib'),
    ...nonEssentialModules.map(name => join(MODULE_FOLDER, name)),
  ];

  for (const folder of toDelete) {
    await rmdir(folder, {
      recursive: true,
      force: true,
    });
  }
}
