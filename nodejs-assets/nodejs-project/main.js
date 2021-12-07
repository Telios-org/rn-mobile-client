const bridge = require('rn-bridge')
const crypto = require('crypto')

const userDataPath = bridge.app.datadir()

const Drive = require('@telios/nebula-drive')
const DHT = require('@hyperswarm/dht')
const Hypercore = require('hypercore')

// Monkey patch out the locking in hypercore storage
// For some reason fsctl.lock doesn't seem to want to work
const originalStorage = Hypercore.defaultStorage
Hypercore.defaultStorage = (storage, opts = {}) => {
  return originalStorage(storage, { ...opts, lock: -1 })
}

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
    // createCore()
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

    const publicKey = drive.publicKey.toString('hex')

    bridge.channel.send({
      type: 'driveReady',
      publicKey
    })

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
