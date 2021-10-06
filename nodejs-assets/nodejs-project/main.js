const rn = require('rn-bridge')

// Echo every message received from react-native.
rn.channel.on('message', (msg) => {
  rn.channel.send(msg)
})

// Inform react-native node is initialized.
rn.channel.send('Node was initialized.')
