const bridge = require('rn-bridge')
const crypto = require('crypto')

const userDataPath = bridge.app.datadir()

const Drive = require('@telios/nebula-drive')
const DHT = require('@hyperswarm/dht')

const keyPair = DHT.keyPair()
const swarmOpts = {
  server: true,
  client: true
}

// Echo every message received from react-native.
bridge.channel.on('message', (msg) => {
  console.log(msg)
  const { type } = msg

  if (type === 'createDrive') {
    const { key: givenKey } = msg
    const key = givenKey ? Buffer.from(givenKey, 'hex') : null
    createDrive(key)
  }
})

// Inform react-native that node is initialized.
bridge.channel.send({
  type: 'ready',
  log: 'Node was initialized.'
})

async function createDrive (key) {
  const dir = userDataPath + '/' + crypto.randomBytes(4).toString('hex')

  console.log('Opening drive in', dir)

  const drive = new Drive(dir, key, {
    keyPair,
    swarmOpts
  })

  console.log('Initializing drive')

  try {
    drive.on('sync', () => {
      bridge.channel.send({
        type: 'driveSync'
      })
    })

    await drive.ready()

    const publicKey = drive.publieKey.toString('hex')

    bridge.channel.send({
      type: 'driveReady',
      publicKey
    })

    return

    await drive.connect()

    bridge.channel.send({
      type: 'driveConnected'
    })
  } catch (e) {
    console.error('Unable to initialize drive for key', key)
    console.error(e.stack)
    console.error(e.path)
    drive.close()
  }
}
