import { apiSlice } from './apiSlice';

export const tagDriverSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get tag drivers by CompanyId with pagination and search
    GetTagDrivers: builder.query({
      query: ({ companyId, page, limit, searchTerm, station }) => {
        let url = `/vehicles/tag/driver/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          url += `&search=${searchTerm}`;
        }
        if (station) {
          url += `&station=${station}`;
        }
        return url;
      },
      providesTags: ['TagDriver'],
    }),
    // Get tagged Driver
    GetTagDriver: builder.query({
      query: (id) => `/vehicles/tagged-driver/${id}`,
      providesTags: ['TagDriver'],
    }),

    GetTagDriversFromVehicle: builder.query({
      query: (vehicleId) =>
        `/vehicles/tag/driver/get-from-vehicleId/${vehicleId}`,
      providesTags: ['TagDriver'],
    }),

    // Add company Vehicle
    AddTagDriver: builder.mutation({
      query: (formData) => ({
        url: '/vehicles/tag/driver',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['TagDriver'],
    }),

    // Update Tagged Driver Vehicle
    UpdateTaggedDriver: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/vehicles/tagged-driver/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['TagDriver'],
    }),

    // Delete Tagged Driver Vehicle
    DeleteTaggedDriver: builder.mutation({
      query: (id) => ({
        url: `/vehicles/tagged-driver/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TagDriver'],
    }),
  }),
});

export const {
  useGetTagDriversQuery,
  useGetTagDriverQuery,
  useGetTagDriversFromVehicleQuery,
  useAddTagDriverMutation,
  useUpdateTaggedDriverMutation,
  useDeleteTaggedDriverMutation,
} = tagDriverSlice;
