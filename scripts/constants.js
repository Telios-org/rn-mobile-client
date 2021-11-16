const { join } = require('path')

const ROOT = join(__dirname, '../')

const ANDROID_DIR = join(ROOT, 'android')
const IOS_DIR = join(ROOT, 'ios')

const PROJECT_DIR = process.env.PROJECT_DIR || join(ROOT, 'nodejs-assets/nodejs-project/')
const MODULE_FOLDER = join(PROJECT_DIR, 'node_modules')

const NODEJS_MOBILE_DIR = join(ROOT, 'node_modules/nodejs-mobile-react-native')

module.exports = {
  ANDROID_DIR,
  IOS_DIR,
  PROJECT_DIR,
  NODEJS_MOBILE_DIR,
  MODULE_FOLDER,
  ROOT
}
