import { apiSlice } from './apiSlice';

export const usersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get users by CompanyId with pagination and search
    GetUserByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm }) => {
        if (searchTerm) {
          return `/users/company/${companyId}?search=${searchTerm}&page=${page}&limit=${limit}`;
        } else {
          return `/users/company/${companyId}?page=${page}&limit=${limit}`;
        }
      },
      providesTags: ['User'],
    }),
    // Get All User Info
    GetAllUsersInfo: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // Get One User
    GetUser: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),

    // Add company users
    AddCompanyUser: builder.mutation({
      query: (formData) => ({
        url: '/users',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // Update Company User
    UpdateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete Company User
    DeleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Get users by RoleId
    getUserByRoleId: builder.query({
      query: ({ roleId, station }) => {
        let queryString = `/users/role/${roleId}`;
        if (station) {
          queryString += `?station=${station}`;
        }
        return queryString;
      },
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserByCompanyIdQuery,
  useGetAllUsersInfoQuery,
  useGetUserQuery,
  useAddCompanyUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByRoleIdQuery,
} = usersSlice;
