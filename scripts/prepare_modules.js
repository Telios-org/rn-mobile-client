#!/usr/bin/env node
const { existsSync } = require('fs');
const { rmdir, mkdir, writeFile } = require('fs').promises;
const { join } = require('path');

const { PROJECT_DIR, MODULE_FOLDER } = require('./constants');

run().catch(e => {
  process.nextTick(() => {
    throw e;
  });
});

async function run() {
  // console.log('Deleting .bin dir to fix builds');
  // const BIN_DIR = join(PROJECT_DIR, 'node_modules/.bin');
  // await rmdir(BIN_DIR, { recursive: true, force: true });

  console.log('Clearing duplicate sodium-native and udx-native modules');
  const DUPLICATE_FOLDERS = [
    'sodium-universal/node_modules/sodium-native',
    '@telios/nebula-drive/node_modules/sodium-native',
    'hmac-blake2b/node_modules/sodium-native',
    'blake2b-universal/node_modules/sodium-native',
    'xsalsa20-universal/node_modules/sodium-native',
    'noise-curve-ed/node_modules/sodium-native',
    'hypercore-peer-auth/node_modules/sodium-native',
    '@hyperswarm/dht/node_modules/udx-native',
    'hyperswarm/node_modules/udx-native',
  ];

  for (const folder of DUPLICATE_FOLDERS) {
    const location = join(MODULE_FOLDER, folder);
    if (existsSync(location)) {
      console.log('Clearing', location);
      await rmdir(location, { recursive: true, force: true });
    }
  }

  const SODIUM_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/sodium-native');
  if (existsSync(SODIUM_NATIVE_DIR)) {
    console.log('Clearing existing sodium-native package');
    await rmdir(SODIUM_NATIVE_DIR, { recursive: true, force: true });
  }

  const SODIUM_NATIVE_MOBILE_DIR = join(
    MODULE_FOLDER,
    'sodium-native-nodejs-mobile',
  );
  if (existsSync(join(SODIUM_NATIVE_MOBILE_DIR, 'build'))) {
    console.log('Clearing sodium-native-nodejs-mobile build');
    await rmdir(join(SODIUM_NATIVE_MOBILE_DIR, 'build'), {
      recursive: true,
      force: true,
    });
  }

  console.log('Creating fake sodium-native package');
  await mkdir(SODIUM_NATIVE_DIR, { recursive: true, force: true });
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'package.json'),
    JSON.stringify({
      name: 'sodium-native',
      main: 'index.js',
      // Technically the version is 3.2.0, but that is just a change to builds, not API
      version: '3.3.0',
    }),
  );
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'index.js'),
    "module.exports = require('sodium-native-nodejs-mobile')\n",
  );

  const UDX_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/udx-native');
  if (existsSync(UDX_NATIVE_DIR)) {
    console.log('Clearing existing udx-native package');
    await rmdir(UDX_NATIVE_DIR, { recursive: true, force: true });
  }

  console.log('Creating fake udx-native package');
  await mkdir(UDX_NATIVE_DIR, { recursive: true, force: true });
  await writeFile(
    join(UDX_NATIVE_DIR, 'package.json'),
    JSON.stringify({ name: 'udx-native', main: 'index.js', version: '1.5.1-0' }),
  );
  await writeFile(
    join(UDX_NATIVE_DIR, 'index.js'),
    "module.exports = require('udx-native-nodejs-mobile')\n",
  );

  console.log('Patch imports for sodium and utp mobile');
  const SODIUM_INDEX = join(
    PROJECT_DIR,
    'node_modules/sodium-native-nodejs-mobile/index.js',
  );
  await writeFile(
    SODIUM_INDEX,
    `
var path = require('path')
var requirePath = path.join(__dirname, 'build/Release/sodium.node')
var sodium = require(requirePath)

module.exports = sodium;
`,
  );

  const UTP_BINDING = join(
    PROJECT_DIR,
    'node_modules/udx-native-nodejs-mobile/lib/binding.js',
  );
  await writeFile(
    UTP_BINDING,
    `
var path = require('path')

module.exports = require('bindings')({
  bindings: 'udx_native.node',
  name: 'udx-native-nodejs-mobile',
  module_root: path.join(__dirname, '../')
})
`,
  );
}
