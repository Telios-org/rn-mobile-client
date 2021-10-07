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

- [ ] Set up nodejs-mobile
- [ ] Get SDK running
	- [ ] sodium-native
	- [ ] utp-native
	- [ ] ??
- [ ] Get sqlcipher running
- [ ] Port workers from desktop
- [ ] Set up RPC to react-native
- [ ] rn-tape tests or a minimal demo
- [ ] Test iOS and XCode docs
