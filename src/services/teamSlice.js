import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apiSlice from './apiSlice';

export const teamSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeams: builder.query({
            query: () => '/teams', 
            providesTags: ['Teams'],
        }),
    }),
});

export const { useGetTeamsQuery } = teamApi;

