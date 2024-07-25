import { createSlice } from '@reduxjs/toolkit';
import * as Actions from './actions';
import { addCaseWithLoading } from '../../utils/helpers';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  role: '',
  permissions: [],
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState(state) {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    addCaseWithLoading(builder, Actions.loginUser, {
      onCompleted: (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.role = action.payload.data.user.Role.roleName;
        state.permissions = action.payload.data.user.Role.rolePermissions.map(
          (e) => e.module.name,
        );
        state.token = action.payload.token;
      },
      onPending: (state) => {
        (state.isLoading = true), (state.user = null);
        state.user = null;
      },
      onReject: (state, error) => {
        console.log(error);
        state.user = null;
        state.isLoading = false;
      },
    });
  },
});

export const { loginUser, sendCredentials } = Actions;
export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
