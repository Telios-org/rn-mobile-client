const bridge = require('rn-bridge');
const crypto = require('crypto');

const userDataPath = bridge.app.datadir();

const Drive = require('@telios/nebula-drive');
const DHT = require('@hyperswarm/dht');
const Hypercore = require('hypercore');

const { Account, Mailbox, Crypto } = require('@telios/client-sdk');
const { secretBoxKeypair, signingKeypair, mnemonic } = Account.makeKeys();

// Verification code sent to the recovery email
const vcode = 'btester1';

// Monkey patch out the locking in hypercore storage
// For some reason fsctl.lock doesn't seem to want to work
const originalStorage = Hypercore.defaultStorage;
Hypercore.defaultStorage = (storage, opts = {}) => {
  return originalStorage(storage, { ...opts, lock: -1 });
};

const keyPair = DHT.keyPair();
const swarmOpts = {
  server: true,
  client: true,
};

// Echo every message received from react-native.
bridge.channel.on('message', msg => {
  console.log(msg);
  const { type } = msg;

  if (type === 'createDrive') {
    const { key: givenKey } = msg;
    const key = givenKey ? Buffer.from(givenKey, 'hex') : null;
    createDrive(key);
    // createCore()
  } else if (type === 'registerAccount') {
    const driveKey = msg.driveKey;
    console.log('got drive key', driveKey);
    registerAccount(driveKey);
  }
});

// Inform react-native that node is initialized.
bridge.channel.send({
  type: 'ready',
  log: 'Node was initialized.',
});

// ----- Create Drive ------

async function createDrive(key) {
  // Drive encryption key. This will need to be stored as it's the key to unlock the drive when the user comes back online.
  const encryptionKey = Buffer.from(Crypto.generateAEDKey(), 'hex');
  console.log('enc key using Crypto', encryptionKey);

  const dir = userDataPath + '/' + crypto.randomBytes(4).toString('hex');
  // const dir = userDataPath + '/justin@telios.io';

  console.log('Opening drive in', dir);

  // const drive = new Drive(dir, key, {
  //   keyPair,
  //   swarmOpts,
  // });

  // Initialize a new drive
  const drive = new Drive(dir, null, {
    keyPair: {
      publicKey: Buffer.from(signingKeypair.publicKey, 'hex'),
      secretKey: Buffer.from(signingKeypair.privateKey, 'hex'),
    },
    encryptionKey,
    swarmOpts: {
      server: true,
      client: true,
    },
  });

  console.log('Initializing drive');

  try {
    drive.on('sync', () => {
      bridge.channel.send({
        type: 'driveSync',
      });
    });

    await drive.ready();

    const publicKey = drive.publicKey.toString('hex');

    console.log('drive diffkey:', drive.diffFeedKey);

    bridge.channel.send({
      type: 'driveReady',
      publicKey,
      diffKey: drive.diffFeedKey,
    });

    await drive.connect();

    bridge.channel.send({
      type: 'driveConnected',
      publicKey,
      diffKey: drive.diffFeedKey,
    });
  } catch (e) {
    console.error('Unable to initialize drive for key', key);
    console.error(e.stack);
    console.error(e.path);
    drive.close();
  }
}

// ----- register Account ------

async function registerAccount(driveKey) {
  console.log('registerAccount  - entry', driveKey);

  // const account = new Account({
  //   provider: 'https://apiv1.telios.io',
  // });

  // const account = new Account({
  //   provider: 'https://devapiv1.telios.io', // dev environment
  // });

  const initPayload = {
    account: {
      account_key: secretBoxKeypair.publicKey,
      recovery_email: 'jpoliachik@gmail.com',
      device_drive_key: driveKey,
      device_signing_key: signingKeypair.publicKey,
    },
  };

  try {
    const { account, sig } = await Account.init(
      initPayload,
      signingKeypair.privateKey,
    );

    console.log('after account.init', account, sig);

    const acct = new Account('https://devapiv1.telios.io');

    console.log('after new account', acct);

    const registerPayload = {
      account,
      sig: sig,
      vcode: vcode,
    };

    console.log('register with payload', registerPayload);
    // Send the account object that was just signed to be stored and
    // verified on the server for later authentication.
    const { _sig } = await acct.register(registerPayload);

    console.log('SIGNATURE', _sig);
  } catch (err) {
    console.log('error - ', err);
  }

  /*console.log('registerAccount  - account', account);

  // Drive encryption key. This will need to be stored as it's the key to unlock the drive when the user comes back online.
  const encryptionKey = Buffer.from(Crypto.generateAEDKey(), 'hex');

  const initPayload = {
    account: {
      account_key: secretBoxKeypair.publicKey,
      recovery_email: 'jpoliachik@gmail.com',
      device_drive_key: driveKey,
      device_signing_key: signingKeypair.publicKey,
    },
  };

  console.log('registerAccount  - initPayload', initPayload);

  const initResponse = await Account.init(
    initPayload,
    signingKeypair.privateKey,
  );
  // initResponse.account;
  // initResponse.sig;

  console.log('registerAccount  - init response', initResponse);

  const registerPayload = {
    account: initResponse.account,
    sig: initResponse.sig,
    vcode: vcode,
  };

  console.log('register payload: ', registerPayload);

  // Send the account object that was just signed to be stored and
  // verified on the server for later authentication.
  const res = await account.register(registerPayload);

  console.log('registerAccount  - res', res);
  */

  // You'll want to store the signature from the account.register response (_sig). In the future requests this is what you will use for refresh tokens when authorizing with the server.
}

/*

Example From Gareth:

const { Account, Mailbox, Crypto } = require("@telios/client-sdk");
  const { secretBoxKeypair, signingKeypair, mnemonic } = Account.makeKeys();
  const Drive = require('@telios/nebula-drive');

  // Verification code sent to the recovery email
  const vcode = "btester1";

  try {
  const acct = new Account("https://devapiv1.telios.io");

  // Drive encryption key. This will need to be stored as it's the key to unlock the drive when the user comes back online.
  const encryptionKey = Buffer.from(Crypto.generateAEDKey(), 'hex');

  // Initialize a new drive
  const drive = new Drive(__dirname + '/justin@telios.io', null, {
    keyPair: {
      publicKey: Buffer.from(signingKeypair.publicKey, 'hex'),
      secretKey: Buffer.from(signingKeypair.privateKey, 'hex')
    },
    encryptionKey,
    swarmOpts: {
      server: true,
      client: true
    }
  });

  // Wait for drive to connect to network
  await drive.ready();

  const initPayload = {
    account: {
      account_key: secretBoxKeypair.publicKey,
      recovery_email: 'justin.poliachik@gmail.com',
      device_drive_key: drive.publicKey,
      device_signing_key: signingKeypair.publicKey
    },
  };

  const { account, sig } = await Account.init(
    initPayload,
    signingKeypair.privateKey
  );

  const registerPayload = {
    account,
    sig: sig,
    vcode: vcode,
  };

  // Send the account object that was just signed to be stored and
  // verified on the server for later authentication.
  const { _sig } = await acct.register(registerPayload);

  console.log('SIGNATURE', _sig)
  } catch(e) {
    console.log('ERR', e)
  }

  */
