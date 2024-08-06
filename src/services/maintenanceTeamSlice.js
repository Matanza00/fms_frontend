import apiSlice from './apiSlice';

export const maintenanceTeamSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicles: builder.query({
      query: ({ page, limit, searchTerm, station }) => {
        let queryString = `/maintenance-team/all-vehicles?page=${page}&limit=${limit}`;
        if (searchTerm) {
          queryString += `&search=${searchTerm}`;
        }
        if (station) {
          queryString += `&station=${station}`;
        }
        return queryString;
      },
      providesTags: ['MaintenanceTeam'],
    }),

    // Add Maintenance Team
    addMaintenanceTeam: builder.mutation({
      query: (formData) => ({
        url: '/maintenance-team',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['MaintenanceTeam'],
    }),

    // Get all Maintenance Teams
    getAllMaintenanceTeams: builder.query({
      query: () => '/maintenance-team',
      providesTags: ['MaintenanceTeam'],
    }),

    // Get one Maintenance Team by ID
    getOneMaintenanceTeam: builder.query({
      query: (teamId) => `/maintenance-team/${teamId}`,
      providesTags: ['MaintenanceTeam'],
    }),

    // Update Maintenance Team
    updateMaintenanceTeam: builder.mutation({
      query: ({ teamId, ...formData }) => ({
        url: `/maintenance-team/${teamId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['MaintenanceTeam'],
    }),
    // Delete Maintenance Team
    deleteMaintenanceTeam: builder.mutation({
      query: (teamId) => ({
        url: `/maintenance-team/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MaintenanceTeam'],
    }),

    
  }),
});

export const {
  useAddMaintenanceTeamMutation,
  useGetAllVehiclesQuery,
  useGetAllMaintenanceTeamsQuery,
  useGetOneMaintenanceTeamQuery,
  useUpdateMaintenanceTeamMutation,
  useDeleteMaintenanceTeamMutation,
} = maintenanceTeamSlice;
