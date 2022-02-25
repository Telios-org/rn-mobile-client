// import { registerAccount } from './src/account';

console.log('RUNNING NODE VERSION: ', process.version);

const bridge = require('rn-bridge');
const Hypercore = require('hypercore');
const HypercoreInTelios1 = require('./node_modules/@telios/nebula/node_modules/corestore/node_modules/hypercore/index');
const HypercoreInTelios2 = require('./node_modules/@telios/nebula-drive/node_modules/hypercore/index');

const { ClientBackend } = require('@telios/telios-client-backend');

// Monkey patch out the locking in hypercore storage
// For some reason fsctl.lock doesn't seem to want to work
// resulting in errors like "Error: ELOCKED: File is locked"
const originalStorage = Hypercore.defaultStorage;
Hypercore.defaultStorage = (storage: any, opts = {}) => {
  return originalStorage(storage, { ...opts, lock: -1 });
};
// // There is another instance of Hypercore in @telios libraries,
// // do the same monkey-patch here too.
const originalStorageInTelios1 = HypercoreInTelios1.defaultStorage;
HypercoreInTelios1.defaultStorage = (storage: any, opts = {}) => {
  return originalStorageInTelios1(storage, { ...opts, lock: -1 });
};
const originalStorageInTelios2 = HypercoreInTelios2.defaultStorage;
HypercoreInTelios2.defaultStorage = (storage: any, opts = {}) => {
  return originalStorageInTelios2(storage, { ...opts, lock: -1 });
};

// const channel = bridge.channel;

const userDataPath = bridge.app.datadir();
const env = 'development';

console.log('userDataPath', userDataPath);

// const ClientBackend = ({ channel, userDataPath, env }) => {
//   channel.on('message', msg => {
//     console.log('MESSAGE', msg);
//     channel.send(msg);
//   });
// };

// ClientBackend({
//   channel: bridge.channel,
//   userDataPath: '/some/path',
//   env: 'development',
// });

// Instantiate backend
ClientBackend(bridge.channel, userDataPath, env);

// channel.send({
//   event: 'account:create',
//   payload: {
//     email: 'justin10@dev.telios.io',
//     password: 'letmein123',
//     vcode: 'btester1',
//     recoveryEmail: 'alice@mail.com',
//   },
// });

// channel.on('account:create:error', (error: any) => {
//   console.log('accoutn create error', error);
//   // handle error
// });

// channel.on('account:create:success', (data: any) => {
//   console.log('account create success', data);
//   // handle success
// });
