import { apiSlice } from './apiSlice';

export const dailySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get One Vehicle
    getDailyReports: builder.query({
      query: ({ userId, station }) => {
        let queryString = `/daily/vehicles/${userId}`;

        if (station) {
          queryString += `?station=${station}`;
        }

        return queryString;
      },
      providesTags: ['Daily'],
    }),

    getAllDailyReports: builder.query({
      query: ({ station }) => {
        let queryString = `/daily`;

        if (station) {
          queryString += `?station=${station}`;
        }

        return queryString;
      },
      providesTags: ['Daily'],
    }),

    getChecklistData: builder.query({
      query: ({ registrationNo }) =>
        `/daily/checklist?registrationNo=${registrationNo}`,
      providesTags: ['Daily'],
    }),

    // Add Daily Request
    AddDailyRequest: builder.mutation({
      query: (formData) => ({
        url: '/daily',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Daily'],
    }),

    // Update Company Vehicle
    UpdatePeriodicRequest: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/daily/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Daily'],
    }),

    //  Delete company vehicle User
    DeleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fuel'],
    }),
  }),
});

export const {
  useGetDailyReportsQuery,
  useGetAllDailyReportsQuery,
  useAddDailyRequestMutation,
  useGetChecklistDataQuery,
} = dailySlice;
