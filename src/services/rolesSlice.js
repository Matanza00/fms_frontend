import { apiSlice } from './apiSlice';

// const usersAdapter = createEntityAdapter({});

// const initialState = usersAdapter.getInitialState();

export const rolesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get users by CompanyId
    GetRolesByCompanyId: builder.query({
      query: (companyId) => `/roles/company/${companyId}`,
      providesTags: ['Role'],
    }),
    GetRolesAndPermissionsByCompanyId: builder.query({
      query: (companyId) => `/roles/all/company/${companyId}`,
      providesTags: ['Role'],
    }),
    UpdateRolePermissions: builder.mutation({
      query: ({ roleId, data }) => ({
        url: `/roles/${roleId}`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useGetRolesByCompanyIdQuery,
  useGetRolesAndPermissionsByCompanyIdQuery,
  useUpdateRolePermissionsMutation,
} = rolesSlice;
