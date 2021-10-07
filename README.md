# Telios Mobile

A mobile client for [telios](https://telios.io).

**In Progress**

## Building

- set up node.js
- set up node-gyp
- set up react-native and it's dependencies
- `yarn` to install deps

- Android:
	- set up Android studio
	- `cd android && ./gradlew clean && cd ../`
- iOS:
	- Set up XCode
	- `sudo gem install cocoapods`
	- `pod setup`
	- `cd ios && pod install && cd ../`
- Apply this patch for EventEmitter import after installing: https://github.com/JaneaSystems/nodejs-mobile-react-native/pull/20/files
- Apply these fixes to metro.config.js (different from the current README since APIs changed) https://github.com/JaneaSystems/nodejs-mobile/issues/314#issuecomment-832491168
- Open in Android Studio to make sure it's all running

## TODO:

- [x] Set up nodejs-mobile
- [ ] Get SDK running
	- [ ] sodium-native
		- Check out how [Gateway Browser](https://gitlab.com/gateway-browser/gateway/-/blob/master/tools/build-backend.js) does it
		- Maybe use sodium-native-nodejs-mobile? Needs updates? [diff](https://github.com/sodium-friends/sodium-native/compare/master...staltz:master)
	- [ ] utp-native
		- Use [utp-native-nodejs-mobile?](https://github.com/mafintosh/utp-native/compare/master...staltz:master)
	- [ ] Other native deps?
- [ ] Get sqlcipher running
	- Can we reuse [react-native-sqlcipher](https://www.npmjs.com/package/react-native-sqlcipher)?
- [ ] Port workers from desktop
- [ ] Set up RPC to react-native
- [ ] rn-tape tests or a minimal demo
- [ ] Test iOS and XCode docs
