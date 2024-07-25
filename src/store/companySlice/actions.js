import { createAsyncThunk } from '@reduxjs/toolkit';
import { Delete, get, patch, post } from '../../utils/fetch';

export const getAllCompanies = createAsyncThunk(
  'companies/allCompanies',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await get(`super-admin/company`, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const getCompany = createAsyncThunk(
  'companies/getOne',
  ({ id }) =>
    new Promise((resolve, reject) => resolve(get(`super-admin/company/${id}`))),
);

export const addCompany = createAsyncThunk(
  'companies/add',
  ({ payload }) =>
    new Promise((resolve, reject) =>
      resolve(post(`super-admin/company`, payload)),
    ),
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  ({ id, payload }) =>
    new Promise((resolve, reject) =>
      resolve(patch(`super-admin/company/${id}`, payload)),
    ),
);

export const deleteCompany = createAsyncThunk(
  'companies/delete',
  ({ id }) =>
    new Promise((resolve, reject) =>
      resolve(Delete(`super-admin/company/`, id)),
    ),
);

export const addCompanyAdmin = createAsyncThunk(
  'companies/addAdmin',
  ({ payload }) =>
    new Promise((resolve, reject) =>
      resolve(post(`super-admin/create-company-admin`, payload)),
    ),
);
export const getCompanyAdmin = createAsyncThunk(
  'companies/getAdmin',
  ({ id }) =>
    new Promise((resolve, reject) =>
      resolve(get(`super-admin/get-comapny-admin/${id}`)),
    ),
);
