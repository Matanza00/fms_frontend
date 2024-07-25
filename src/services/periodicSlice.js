import { apiSlice } from './apiSlice';

export const periodicSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetPeriodicByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm }) => {
        if (searchTerm) {
          return `/periodic?search=${searchTerm}&page=${page}&limit=${limit}`;
        } else {
          return `/periodic?page=${page}&limit=${limit}`;
        }
      },
      providesTags: ['Periodic'],
    }),
    getPeriodicReports: builder.query({
      query: () => `/periodic/reports/get`,
      providesTags: ['Periodic'],
    }),

    // Get One Vehicle
    getPeriodicRequest: builder.query({
      query: (id) => `/periodic/${id}`,
      providesTags: ['Periodic'],
    }),

    getOneVehicleDetails: builder.query({
      query: (vehicleNo) => `/periodic/vehicle/details/${vehicleNo}`,
      providesTags: ['Periodic'],
    }),

    getOneVehiclePeriodicTypeDetails: builder.query({
      query: ({ vehicleNo, periodicType }) =>
        `/periodic/vehicle/last-record/${periodicType}/${vehicleNo}`,
      providesTags: ['Periodic'],
    }),

    // Add Periodic Request
    AddPeriodicRequest: builder.mutation({
      query: (formData) => ({
        url: '/periodic',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Periodic'],
    }),

    addPeriodicParameter: builder.mutation({
      query: (formData) => ({
        url: '/periodic/parameter/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Periodic'],
    }),
    getPeriodicParameters: builder.query({
      query: () => `/periodic/parameter/get`,
      providesTags: ['Periodic'],
    }),

    // Update Periodic Request
    UpdatePeriodicRequest: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/periodic/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Periodic'],
    }),

    // Delete Periodic Request
    DeleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fuel'],
    }),

    // New endpoint for fetching all periodic maintenance data
    getAllPeriodicMaintenance: builder.query({
      query: () => `/periodic/all`,
      providesTags: ['Periodic'],
    }),
  }),
});

export const {
  useGetPeriodicByCompanyIdQuery,
  useGetPeriodicRequestQuery,
  useGetOneVehicleDetailsQuery,
  useGetOneVehiclePeriodicTypeDetailsQuery,
  useAddPeriodicRequestMutation,
  useUpdatePeriodicRequestMutation,
  useDeleteVehicleMutation,
  useAddPeriodicParameterMutation,
  useGetPeriodicParametersQuery,
  useGetPeriodicReportsQuery,
  useGetAllPeriodicMaintenanceQuery, // Add this line
} = periodicSlice;
