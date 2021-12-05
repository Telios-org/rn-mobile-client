#!/usr/bin/env node
const browserify = require('browserify')
const { createWriteStream } = require('fs')
const { join } = require('path')

const { PROJECT_DIR } = require('./constants')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  const entry = join(PROJECT_DIR, 'main.js')
  const output = join(PROJECT_DIR, 'bundle.js')
  console.log(`Compiling bundle from ${entry} to ${output}`)
  const build = browserify(entry, {
    basedir: PROJECT_DIR,
    ignoreMissing: true,
    node: true
  })

  const progress = build.bundle().pipe(createWriteStream(output))

  await new Promise((resolve, reject) => {
    progress.once('error', reject)
    progress.once('close', resolve)
  })

  console.log('Built')
}
