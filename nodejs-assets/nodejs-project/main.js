const rn = require('rn-bridge')

// Echo every message received from react-native.
rn.channel.on('message', (msg) => {
  console.log(msg)
})

// Set up all the backend workers
// TODO: Should this export be a function that takes some sort of config?
require('telios-backend/mobile')

// Inform react-native node is initialized.
rn.channel.send('Node was initialized.')
