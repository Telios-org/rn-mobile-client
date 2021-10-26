/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  // Might help with some edge cases
  // TODO: See if this can be disabled for perf improvements
  resetCache: true,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  resolver: {
    blockList: [
      /\/nodejs-assets\/.*/,
      /\/android\/.*/,
      /\/ios\/.*/
    ]
  }
}
