export type Section = {
  title: string;
  description: string;
  fields: Array<SectionField>;
};

export type SectionField = {
  title: string;
  key: string;
  shouldHide: boolean;
};

export const sections: Array<Section> = [
  {
    title: 'Device Signature',
    description:
      'The key pair used to sign your communication over the network, thus ensuring that your traffic is safe and authenticated.',
    fields: [
      {
        title: 'Device Id',
        key: 'deviceInfo.deviceId',
        shouldHide: false,
      },
      {
        title: 'Signing Public Key',
        key: 'deviceInfo.keyPair.publicKey',
        shouldHide: false,
      },
      {
        title: 'Signing Private Key',
        key: 'deviceInfo.keyPair.secretKey',
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
