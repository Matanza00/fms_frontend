import { createAsyncThunk } from '@reduxjs/toolkit';
import { post, postWithoutToken } from '../../utils/fetch';

export const loginUser = createAsyncThunk(
  'auth/login',
  ({ payload }) =>
    new Promise((resolve, reject) => {
      resolve(postWithoutToken(`auth/login`, payload));
    }),
);

export const sendCredentials = createAsyncThunk(
  'auth/sendCredentials',
  ({ id }) =>
    new Promise((resolve, reject) =>
      resolve(post(`auth/send-credentials/${id}`)),
    ),
);
