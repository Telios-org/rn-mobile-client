export const sections = [
  {
    title: 'Device Signature',
    description:
      'The key pair used to sign your communication over the network, thus ensuring that your traffic is safe and authenticated.',
    fields: [
      {
        title: 'Device Id',
        key: 'deviceId',
        shouldHide: false,
      },
      {
        title: 'Signing Public Key',
        key: 'deviceSigningPubKey',
        shouldHide: false,
      },
      {
        title: 'Signing Private Key',
        key: 'deviceSigningPrivKey',
        shouldHide: true,
      },
    ],
  },
  {
    title: 'Data Encryption',
    description:
      'The key pair information used to encrypt all of your data at rest.',
    fields: [
      {
        title: 'Secret Box Public Key',
        key: 'secretBoxPubKey',
        shouldHide: false,
      },
      {
        title: 'Secret Box Private Key',
        key: 'secretBoxPrivKey',
        shouldHide: true,
      },
    ],
  },
];
