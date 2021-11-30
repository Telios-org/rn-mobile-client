# Telios Mobile

A mobile client for [telios](https://telios.io).

**In Progress**

## Building

- set up node.js 12.19.x
- set up [node-gyp](https://www.npmjs.com/package/node-gyp) with `npm install -g node-gyp`
- set up react-native and it's dependencies
- `yarn` to install deps
- Android:
	- set up Android studio
	- Install NDK via the SDK manager
	- Set up `ANDROID_HOME` environment variable (might be automatic)
	- Set up `ANDROID_NDK_HOME` environment variable (should be something like `$ANDROID_HOME/ndk/21.4.7075529`)
	- Make sure you have a bunch of RAM on your machine. Might take over 4GB to build the native deps
- iOS:
	- Set up XCode 12.4.x
	- `sudo gem install cocoapods`
	- `pod setup`
	- `brew install autoconf automake libtool openssl`
	- `cd ios && pod install && cd ../`
- Run `node postinstall.js` to set up patches

## How it works:

Hacks:
- (postinstall.js)
	- Modify `node_modules/nodejs-mobile-react-native/android/build.gradle` to remove `main {}` according to [this post](https://github.com/JaneaSystems/nodejs-mobile/issues/317#issuecomment-852033823)
  - Apply this patch for EventEmitter import after installing: https://github.com/JaneaSystems/nodejs-mobile-react-native/pull/20/files
	- Run a build with `NODEJS_MOBILE_BUILD_NATIVE_MODULES=1` once in order to compile native binaries
	- Clear out some uneeded files from node_modules in order to reduce the APK size
- Apply these fixes to metro.config.js (different from the current README since APIs changed) https://github.com/JaneaSystems/nodejs-mobile/issues/314#issuecomment-832491168
- Set up arm ABIs in the build.gradle since they're missing in the default react-native gradle script

## TODO:

- [x] Set up nodejs-mobile
- [ ] Get SDK running
	- [ ] sodium-native
		- Check out how [Gateway Browser](https://gitlab.com/gateway-browser/gateway/-/blob/master/tools/build-backend.js) does it
		- Maybe use sodium-native-nodejs-mobile? Needs updates? [diff](https://github.com/sodium-friends/sodium-native/compare/master...staltz:master)
		- Automate setup - Android
			- `npm install` inside `nodejs-assets/nodejs-project`
			- Delete `tar-fs/test/` since it has weird zip files which can mess with the APK
			- Copy `.so` files from `lib` folder to android/app/src/main/jniLibs according to arch (a la [this scripts](https://gitlab.com/staltz/manyverse/-/blob/master/tools/backend/move-shared-libs-android.sh))
			- Run a build with the `libsodium` folder present so that the headers are available
			  - `yarn android-rebuild`
			- Delete libsodium folder to make the APK small enough to actually install
			- Run another build but with the APK size not being at 5GB
				- `yarn android`
			- Patch `sodium-native` to require `sodium-native-nodejs-mobile`
		- Automate setup - iOS
			- Use `npm install --no-optional` with `PLATFORMNAME=iphoneos`
	- [ ] utp-native
		- Use [utp-native-nodejs-mobile?](https://github.com/mafintosh/utp-native/compare/master...staltz:master)
	- [ ] Other native deps?
- [ ] Get sqlcipher running
	- Can we reuse [react-native-sqlcipher](https://www.npmjs.com/package/react-native-sqlcipher)?
- [ ] Port workers from desktop
- [ ] Set up RPC to react-native
- [ ] rn-tape tests or a minimal demo
- [ ] Test iOS and XCode docs
