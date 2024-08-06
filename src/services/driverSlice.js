import { apiSlice } from './apiSlice';

export const driversSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get drivers by CompanyId with pagination and search
    GetDriverByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm, station }) => {
        let queryString = `/drivers/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        if (station) {
          queryString += `&station=${station}`;
        }
        return queryString;
      },
      providesTags: ['Driver'],
    }),

    // Get All Driver
    GetDriverAll: builder.query({
      query: () => `/drivers/`,
      providesTags: ['Driver'],
    }),
    // Get All Driver Without pagination
    GetDriverAllWithoutPagination: builder.query({
      query: ({ companyId, station }) => {
        let queryString = `/drivers/id/${companyId}`;
        if (station) {
          queryString += `?station=${station}`;
        }
        return queryString;
      },
      providesTags: ['Driver'],
    }),

    // Get One Driver
    GetDriver: builder.query({
      query: (id) => `/drivers/${id}`,
      providesTags: ['Driver'],
    }),

    // Add Driver
    AddDriver: builder.mutation({
      query: (formData) => ({
        url: '/drivers',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Driver'],
    }),

    // Update Company User
    UpdateDriver: builder.mutation({
      query: ({ driverId, data }) => ({
        url: `/drivers/${driverId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Driver'],
    }),

    // Delete driver
    DeleteDriver: builder.mutation({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Driver'],
    }),
  }),
});

export const {
  useGetDriverByCompanyIdQuery,
  useGetDriverAllWithoutPaginationQuery,
  useGetDriverAllQuery,
  useGetDriverQuery,
  useUpdateDriverMutation,
  useAddDriverMutation,
  useDeleteDriverMutation,
} = driversSlice;
