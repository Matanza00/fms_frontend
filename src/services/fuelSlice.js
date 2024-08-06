import { apiSlice } from './apiSlice';

export const fuelSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get fuel by CompanyId with pagination and search
    GetFuelByCompanyId: builder.query({
      query: ({
        companyId,
        page,
        limit,
        searchTerm,
        statusFilter,
        station,
      }) => {
        let url = `/fuel/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          url += `&search=${searchTerm}`;
        }
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        if (station) {
          url += `&station=${station}`;
        }
        return url;
      },
      providesTags: ['Fuel'],
    }),

    // Get One Fuel Request
    getFuelRequest: builder.query({
      query: (id) => `/fuel/${id}`,
      providesTags: ['Fuel'],
    }),

    getFuelCardNo: builder.query({
      query: ({ vehicleId, cardType }) => {
        if (vehicleId && cardType) {
          return `/fuel/fuel-card/get-from-vehicleId/card-type?vehicleId=${vehicleId}&cardType=${cardType}`;
        }
      },
      providesTags: ['Fuel'],
    }),

    // Add Fuel Request
    AddFuelRequest: builder.mutation({
      query: (formData) => ({
        url: '/fuel',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Fuel'],
    }),

    // Update Fuel Request
    UpdateFuelRequest: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/fuel/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Fuel'],
    }),

    // Delete Fuel Request
    DeleteFuelRequest: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fuel'],
    }),

    GetAllFuel: builder.query({
      query: (companyId) => `/fuel/company/complete/${companyId}`,
      providesTags: ['Fuel'],
    }),
  }),
});

export const {
  useGetFuelByCompanyIdQuery,
  // useGetOneVehicleDetailsQuery,
  useGetFuelRequestQuery,
  useGetFuelCardNoQuery,
  useAddFuelRequestMutation,
  useUpdateFuelRequestMutation,
  useDeleteFuelRequestMutation,
  useGetAllFuelQuery,
} = fuelSlice;
