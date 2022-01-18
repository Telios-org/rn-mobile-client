import nodejs from 'nodejs-mobile-react-native';

export const start = () => {
  console.log('starting nodejs bundle...');
  nodejs.start('bundle.js');
  nodejs.channel.addListener('message', msg => {
    console.log('From node: ', msg);
  });

  nodejs.channel.addListener('account:create:success', msg => {
    console.log('account create success: ', msg);
  });

  nodejs.channel.addListener('account:create:error', msg => {
    console.log('account create error message', msg);
  });
};

export const createAccount = (values: {
  masterPassword: string;
  email: string;
  recoveryEmail: string;
  code: string;
}) => {
  nodejs.channel.send({
    event: 'account:create',
    payload: {
      email: values.email,
      password: values.masterPassword,
      vcode: values.code,
      recoveryEmail: values.recoveryEmail,
    },
  });
};
