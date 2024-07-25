import { apiSlice } from './apiSlice';

export const employeeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyEmployees: builder.query({
      query: (companyId) => `/employees/company/${companyId}`,
      providesTags: ['Employee'],
    }),
  }),
});

export const { useGetCompanyEmployeesQuery } = employeeSlice;
