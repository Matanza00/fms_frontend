import { createAsyncThunk } from '@reduxjs/toolkit';
import { Delete, get, patch, post } from '../../utils/fetch';

// export const getAllUsers = createAsyncThunk(
//   'users/allUsers',
//   async (filters,companyId, { rejectWithValue }) => {
//     try {
//       const response = await get(`/users/company/5`, filters);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

export const getAllUsers = createAsyncThunk(
  'users/allUsers',
  ({ id }) => new Promise((resolve, reject) => resolve(get(`users/company/5`))),
);

export const getUser = createAsyncThunk(
  'users/getOne',
  ({ id }) => new Promise((resolve, reject) => resolve(get(`users/${id}`))),
);

export const addUser = createAsyncThunk(
  'users/add',
  ({ payload }) =>
    new Promise((resolve, reject) => resolve(post(`users`, payload))),
);

export const updateUsers = createAsyncThunk(
  'users/update',
  ({ id, payload }) =>
    new Promise((resolve, reject) => resolve(patch(`users/${id}`, payload))),
);

export const updateUser = createAsyncThunk(
  'user/update',
  ({ id, payload }) =>
    new Promise((resolve, reject) => resolve(patch(`users/${id}`, payload))),
);

// export const deleteCompany = createAsyncThunk(
//   'companies/delete',
//   ({ id }) =>
//     new Promise((resolve, reject) =>
//       resolve(Delete(`super-admin/company/`, id)),
//     ),
// );

// export const addCompanyAdmin = createAsyncThunk(
//   'companies/addAdmin',
//   ({ payload }) =>
//     new Promise((resolve, reject) =>
//       resolve(post(`super-admin/create-company-admin`, payload)),
//     ),
// );
// export const getCompanyAdmin = createAsyncThunk(
//   'companies/getAdmin',
//   ({ id }) =>
//     new Promise((resolve, reject) =>
//       resolve(get(`super-admin/get-comapny-admin/${id}`)),
//     ),
// );
