import { createSlice } from '@reduxjs/toolkit';
import * as Actions from './actions';
import { addCaseWithLoading } from '../../utils/helpers';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  eachUser:null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (data) => {
      state.users.push(data);
    },
  },
  extraReducers: (builder) => {
    addCaseWithLoading(builder, Actions.getAllUsers, {
      onCompleted: (state, action) => {
        state.users = action.payload.data;
      },
    });
    addCaseWithLoading(builder, Actions.addUser, {
      onCompleted: (state, action) => {
        state.users.push(action.payload.data);
      },
    });
    // addCaseWithLoading(builder, Actions.addCompanyAdmin, {
    //   onCompleted: (state, action) => {
    //     state.companyAdmin = action.payload.data;
    //   },
    // });
    // addCaseWithLoading(builder, Actions.getCompanyAdmin, {
    //   onCompleted: (state, action) => {
    //     state.companyAdmin = action.payload.data;
    //   },
    // });
    // addCaseWithLoading(builder, Actions.updateUser, {
    //   onCompleted: (state, action) => {
    //     state.users = state.users.map((user) =>
    //       user.id === action.payload.id
    //         ? { ...user, ...action.payload }
    //         : user,
    //     );
    //   },
    //   onReject: (state) => {
    //     state.isLoading = false;
    //   },
    // });

    addCaseWithLoading(builder, Actions.getUser, {
      onCompleted: (state, action) => {
        state.eachUser = action.payload.data;
      },
    });

    // addCaseWithLoading(builder, Actions.deleteCompany, {
    //   onCompleted: (state, action) => {
    //     state.companies = state.companies.filter(
    //       (e) => e.id !== action.payload,
    //     );
    //   },
    // });
  },
});

export const { getAllUsers, addUser, updateUser, getUser } = Actions;

export default userSlice.reducer;
