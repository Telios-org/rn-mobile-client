#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/Users/telios/.nvm/versions/node/v12.19.1/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/telios/Documents/telios-mobile/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/telios/Documents/telios-mobile/node_modules/.bin:/Users/telios/.nvm/versions/node/v12.19.1/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin
      npm $@
    