# Telios Mobile

A mobile client for [telios](https://telios.io).

**In Progress**

## Building

- set up react-native and it's dependencies
  - Follow React Native docs for React Native CLI, not for Expo https://reactnative.dev/docs/environment-setup
- set up node.js 12.19.x using [nvm](https://github.com/nvm-sh/nvm)
  - this version specifically is needed, and referenced in lots of build scripts.
  - common troubleshooting for build failures in Xcode is to check logs for `"Running node: $(node -v)"` and make sure version is 12.19.x
- set up [node-gyp](https://www.npmjs.com/package/node-gyp) with `npm install -g node-gyp`
- `yarn` to install deps
- add .env.development and .env.production env files to the root directory for different schemas. You can see example variables in the .env.example.
- Android:
  - set up Android studio
  - Install NDK 21.4 via the SDK manager
  - Set up `ANDROID_HOME` environment variable (might be automatic)
  - Set up `ANDROID_NDK_HOME` environment variable (should be something like `$ANDROID_HOME/ndk/21.4.7075529`)
  - Make sure you have a bunch of RAM on your machine. Might take over 4GB to build the native deps
- iOS:
  - Set up XCode 12+
  - `sudo gem install cocoapods`
  - `pod setup`
  - `brew install autoconf automake libtool openssl`
  - `cd ios && pod install && cd ../`
- Before install nodejs dependencies run this command `git config --global url.https://github.com/.insteadOf git://github.com/`, due to the issue with Github restricted ssh port
- Run `yarn run prepare-node-project` to patch modules and install the nodejs-mobile dependencies. (this process may take 5-10 minutes)
  - Make sure it uses the right platform - `install_modules` will only build Node libs for iOS _or_ Android, not both.
  - Use `--ios` or `--android` args to specify. By default, it will use the logic `platform = process.platform === 'darwin' ? IOS : ANDROID`

Run either `yarn android` or `yarn ios` to run on the respective platforms. iOS only works on Macs and you need to register your phone for signing in xcode first. Android has "Debug" and "Release" variants. For Release, keystore will need to be generated.

### Updating Dependencies

- If `/nodejs-assets/nodejs-project/node_modules` gets cleared out (which is often necessary for debugging or whatever), or sometimes when installing updated packages within nodejs-assets, you'll need to run `yarn run prepare-node-project` again from root to rebuild the node libraries.

## How it works:

- Uses [nodejs-mobile-react-native](https://github.com/nodejs-mobile/nodejs-mobile-react-native) in order to run node.js code on mobile (telios/nebula-drive) Code can be found in `nodejs-assets/nodejs-project/`. Communicates to the React-Native thread via a "bridge" that can pass JSON messages
- (npm run prepare-node-project)
  - Modify `node_modules/nodejs-mobile-react-native/android/build.gradle` to remove `main {}` according to [this post](https://github.com/JaneaSystems/nodejs-mobile/issues/317#issuecomment-852033823)
  - Apply this patch for EventEmitter import after installing: https://github.com/JaneaSystems/nodejs-mobile-react-native/pull/20/files
- Apply these fixes to metro.config.js (different from the current README since APIs changed) https://github.com/JaneaSystems/nodejs-mobile/issues/314#issuecomment-832491168
- Set up arm ABIs in the build.gradle since they're missing in the default react-native gradle script
- Monkey-patch Hypercore.defaultStorage to disable the `lock` functionality on `oplog` files since this doesn't seem to work on Android
- Patch `sodium-native` and `utp-native` to point at `sodium-native-nodejs-mobile` and `utp-native-nodejs-mobile` in order to compile they for mobile
- Add scripts to build that do the following:
  - Before building native nodejs libraries, clear some duplicate modules and monkey-patch sodium-native and utp-native to point at their nodejs-mobile variants
  - After building compile all the JS into a single `bundle.js` file starting with `main.js`
  - ON ANDROID: copy the libsodium.la files inside `sodium-native-nodejs-mobile/lib` to `android/app/src/jniLibs`
  - Clear out any unnecessary `node_modules` or files to reduce app size and improve startup

## Debugging

- Make sure you're using the correct version of node.js and NDK/XCode
- Try clearing node_modules and installing them again
- If using android, try clearing `android/app/build`
- Try running the app from within Android Studio or XCode
- Use `console.trace` inside the node_modules to track stuff down inside nodejs-mobile threads

## Distribution

### iOS

- Manually bump the version and build numbers prior to Archive, or upload to AppStoreConnect will fail.
- Manual Signing is needed for Release builds (Automatic is fine for Debug). Download Distribution Certificate from developer.apple.com and import into Xcode manually.
- On Archive and Upload to App Store Connect, make sure to uncheck `Upload your app's symbols` otherwise upload will fail (due to inability to understand Node library symbol files)

### Dev vs Prod apps

There are two different apps setup in Dev console. Telios, and Telios Dev. Telios is pointed to production backend, Telios Dev pointed to dev.

- When distributing an update, set the correct Bundle Identifier, Display Name, and update App Icon to match.
- There is a branch named `prod` which will contain these changes.

Bundle Identifier:

- Prod: `io.telios.mobile`
- Dev: `io.telios.mobile.dev`

## Tech

- Redux / Redux Toolkit

  - We use Redux instead of a more localized state management like Contexts/Hooks because we must be aware of all the incoming events from our Node process. Redux is used to observe all incoming Node events and respond accordingly. It also provides great visibility into all the events happening across our system.
  - [redux-toolkit](https://redux-toolkit.js.org/) removes much of the boilerplate of a vanilla Redux implementation.
  - Recommended to use a Redux debug tool like [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
  - Action names: in general, actions which come from Node are prefixed `node/` and actions initiated within React Native app are prefixed `local/`

- Node / Redux communication
  - React Native communicates with Node by sending events via `nodejs.channel.send` (see `nodeActions.ts`), and receiving events via ` nodejs.channel.addListener` (see `nodeListener.ts`). This utilizes the same technology that React Native's bridge to Native iOS/Android uses, but certain messages are forwarded to Node.
  - The `nodejs-assets/nodejs-project` directory of this project contains code that is executed in the Node environment. We are essentially only using [telios-client-backend](https://github.com/Telios-org/telios-client-backend) here, and forwarding all events to the library.
    - Reference telios-client-backend documentation to see what events we receive/respond to.
