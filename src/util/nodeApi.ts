/*
import nodejs from 'nodejs-mobile-react-native';

export const start = () => {
  console.log('starting nodejs bundle...');
  nodejs.start('bundle.js');
  nodejs.channel.addListener('message', msg => {
    console.log('From node: ', msg);
  });
};

export const registerNewAccount = (values: {
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
*/
