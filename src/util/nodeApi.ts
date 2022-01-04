import nodejs from 'nodejs-mobile-react-native';

export const start = () => {
  console.log('starting nodejs bundle...');
  nodejs.start('bundle.js');
  nodejs.channel.addListener('message', msg => {
    console.log('From node: ', msg);
    // if (msg.type === 'driveReady') {
    //   console.log('got key', msg.publicKey);
    //   setStatusText(JSON.stringify(msg));
    //   setDriveKey(msg.publicKey);
    //   setDriveDiffKey(msg.driveDiffKey);
    // } else if (msg.type === 'registerAccount') {
    //   setStatusText(JSON.stringify(msg));
    // }
  });
};

export const createAccount = (values: {
  masterPassword: string;
  email: string;
  recoveryEmail: string;
  code: string;
}) => {
  nodejs.channel.send({
    type: 'registerAccount',
    data: values,
  });
};
