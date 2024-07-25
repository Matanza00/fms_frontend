import { createSlice } from '@reduxjs/toolkit';
import * as Actions from './actions';
import { addCaseWithLoading } from '../../utils/helpers';

const initialState = {
  companies: [],
  total: 0,
  results: 0,
  eachCompany: null,
  isLoading: false,
  error: null,
  companyAdmin: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setEachCompanyNull: (state) => {
      state.eachCompany = null;
    },
    setCompanyAdminNull: (state) => {
      state.companyAdmin = null;
    },
  },
  extraReducers: (builder) => {
    addCaseWithLoading(builder, Actions.getAllCompanies, {
      onCompleted: (state, action) => {
        state.companies = action.payload.data;
      },
    });
    addCaseWithLoading(builder, Actions.addCompany, {
      onCompleted: (state, action) => {
        state.companies.push(action.payload.data);
      },
    });
    addCaseWithLoading(builder, Actions.addCompanyAdmin, {
      onCompleted: (state, action) => {
        state.companyAdmin = action.payload.data;
      },
    });
    addCaseWithLoading(builder, Actions.getCompanyAdmin, {
      onCompleted: (state, action) => {
        state.companyAdmin = action.payload.data;
      },
    });
    addCaseWithLoading(builder, Actions.updateCompany, {
      onCompleted: (state, action) => {
        state.companies = state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, ...action.payload }
            : company,
        );
      },
      onReject: (state) => {
        state.isLoading = false;
      },
    });

    addCaseWithLoading(builder, Actions.getCompany, {
      onCompleted: (state, action) => {
        state.eachCompany = action.payload.data;
      },
    });

    addCaseWithLoading(builder, Actions.deleteCompany, {
      onCompleted: (state, action) => {
        state.companies = state.companies.filter(
          (e) => e.id !== action.payload,
        );
      },
    });
  },
});

export const {
  getAllCompanies,
  addCompany,
  updateCompany,
  getCompany,
  deleteCompany,
  addCompanyAdmin,
  getCompanyAdmin,
} = Actions;
export const { setEachCompanyNull, setCompanyAdminNull } = companySlice.actions;
export default companySlice.reducer;
