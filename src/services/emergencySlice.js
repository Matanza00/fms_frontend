import { apiSlice } from './apiSlice';

export const emergencySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a list of emergency requests with pagination
    GetEmergencyrequest: builder.query({
      query: ({
        page,
        limit,
        // searchTerm,
        // statusFilter,
        // station,
      }) => {
        let url = `/emergency?page=${page}&limit=${limit}`;
        // Optional filters
        // if (searchTerm) {
        //   url += `&search=${searchTerm}`;
        // }
        // if (statusFilter) {
        //   url += `&status=${statusFilter}`;
        // }
        // if (station) {
        //   url += `&station=${station}`;
        // }
        return url;
      },
      providesTags: ['Emergency'],
    }),

    // Fetch a single emergency request by ID
    getOneEmergencyRequest: builder.query({
      query: (id) => `/emergency/${id}`,
      providesTags: ['Emergency'],
    }),

    // Add a new emergency request
    AddEmergencyRequest: builder.mutation({
      query: (formData) => ({
        url: '/emergency',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Emergency'],
    }),

    // Update an existing emergency request
    UpdateEmergencyRequest: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/emergency/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Emergency'],
    }),

    // Delete an emergency request
    DeleteEmergencyRequest: builder.mutation({
      query: (id) => ({
        url: `/emergency/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Emergency'],
    }),
  }),
});

export const {
  useGetEmergencyrequestQuery,
  useGetOneEmergencyRequestQuery,
  useAddEmergencyRequestMutation,
  useUpdateEmergencyRequestMutation,
  useDeleteEmergencyRequestMutation,
} = emergencySlice;
