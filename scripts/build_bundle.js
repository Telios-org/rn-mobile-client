#!/usr/bin/env node
const browserify = require('browserify');
const tsify = require('tsify');

const { createWriteStream } = require('fs');
const { join } = require('path');

const { ROOT, PROJECT_DIR } = require('./constants');

run().catch(e => {
  process.nextTick(() => {
    throw e;
  });
});

async function run() {
  const entry = join(PROJECT_DIR, 'main.ts');
  const output = join(PROJECT_DIR, 'bundle.js');
  console.log(`Compiling bundle from ${entry} to ${output}`);

  browserify(entry, {
    basedir: PROJECT_DIR,
    ignoreMissing: true,
    node: true,
  })
    .plugin(tsify, { project: join(ROOT, 'tsconfig.json') })
    .bundle()
    .on('error', error => {
      console.error(error.toString());
    })
    .on('close', () => {
      console.log('Built');
    })
    .pipe(createWriteStream(output));

  // const progress = build.bundle().pipe();

  // await new Promise((resolve, reject) => {
  //   progress.once('error', reject);
  //   progress.once('close', resolve);
  // });

  // console.log('Built');
}
