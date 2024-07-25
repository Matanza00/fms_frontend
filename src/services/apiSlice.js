import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Assuming you store token in auth slice
    const preparedHeaders = new Headers(headers);

    if (token) {
      preparedHeaders.set('Authorization', `Bearer ${token}`);
    }

    return preparedHeaders;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: [
    'User',
    'Role',
    'Driver',
    'Vehicle',
    'Employee',
    'TagDriver',
    'Fuel',
    'Periodic',
    'Daily',
    'MaintenanceTeam',
    'Emergency',
  ],
  endpoints: (builder) => ({
    // No need to define endpoints here as they are defined in userSlice
  }),
});

export const { useGetUserByCompanyIdQuery } = apiSlice;

export default apiSlice;
