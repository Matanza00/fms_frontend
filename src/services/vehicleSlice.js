import { apiSlice } from './apiSlice';

export const vehicleSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get vehicles by CompanyId with pagination and search
    GetVehicleByCompanyId: builder.query({
      query: ({ companyId, page, limit, searchTerm, station }) => {
        let queryString = `/vehicles/company/${companyId}?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        if (station) {
          queryString += `&station=${station}`;
        }
        return queryString;
      },
      providesTags: ['Vehicle'],
    }),
    // Get vehicle information
    GetVehicleInfo: builder.query({
      query: (status) => `/vehicles?status=${status}`, // Include the status parameter in the query
      providesTags: ['Vehicle'],
    }),
    // Get One Vehicle
    GetVehicle: builder.query({
      query: (id) => `/vehicles/reg/${id}`,
      providesTags: ['Vehicle'],
    }),
    GetVehicleFromRegistrationNo: builder.query({
      query: (registrationNo) => `/vehicles/reg/${registrationNo}`,
      providesTags: ['Vehicle'],
    }),

    // Add company Vehicle
    AddCompanyVehicle: builder.mutation({
      query: (formData) => ({
        url: '/vehicles',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    // Update Company Vehicle
    UpdateVehicle: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/vehicles/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Vehicle'],
    }),

    //  Delete company vehicle User
    DeleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useGetVehicleByCompanyIdQuery,
  useGetVehicleQuery,
  useGetVehicleInfoQuery,
  useGetVehicleFromRegistrationNoQuery,
  useAddCompanyVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleSlice;
