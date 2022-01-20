import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import {
  registerOneTimeListener,
  removeListeners,
} from './eventListenerMiddleware';
import { RootState, store } from './store';

// Define a type for the slice state
interface MainState {
  loadingRegisterAccount?: boolean;
  errorRegisterAccount?: Error;
  value: number;
}

// Define the initial state using that type
const initialState: MainState = {
  value: 0,
};

export const registerNewAccount = createAsyncThunk(
  'main/registerNewAccount',
  async (data: {
    masterPassword: string;
    email: string;
    recoveryEmail: string;
    code: string;
  }) => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'account:create',
        payload: {
          email: data.email,
          password: data.masterPassword,
          vcode: data.code,
          recoveryEmail: data.recoveryEmail,
        },
      });

      registerOneTimeListener('account:create:success', event => {
        removeListeners('account:create:error');
        const response = event.payload as {
          deviceId: string;
          mnemonic: string;
          secretBoxKeypair: {
            publicKey: string;
            privateKey: string;
          };
          sig: string;
          signedAcct: {
            account_key: string;
            device_drive_key: string;
            device_id: string;
            device_signing_key: string;
            recovery_email: string;
          };
          signingKeypair: {
            mnemonic: string;
            privateKey: string;
            publicKey: string;
            seedKey: string;
          };
          uid: string;
        };
        resolve(response);
      });
      registerOneTimeListener('account:create:error', event => {
        removeListeners('account:create:success');
        reject(event.error);
      });
    });
  },
);

export const mainSlice = createSlice({
  name: 'account',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(registerNewAccount.pending, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
    });
    builder.addCase(registerNewAccount.fulfilled, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
    });
    builder.addCase(registerNewAccount.rejected, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
    });
  },
});

export const { increment, decrement, incrementByAmount } = mainSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.main.value;

export const mainReducer = mainSlice.reducer;
