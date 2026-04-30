import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { HOTEL_SERVICE_BASE_URL, ENDPOINTS } from '../endpoints';
import { getAccessTokenValue } from '../features/auth/authTokenProvider';
import keycloak from '../features/auth/keycloak';

export interface UserProfile {
  name: string;
  email: string;
  keycloakId: string;
  location: string;
  mobileNumber: string;
}

export interface UpdateProfileRequest {
  name: string;
  location: string;
  mobileNumber: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: HOTEL_SERVICE_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessTokenValue();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('401 detected → trying token refresh');
    try {
      await keycloak.updateToken(30);
      result = await baseQuery(args, api, extraOptions);
    } catch (err) {
      console.error('Refresh failed → logout');
      keycloak.logout();
    }
  }

  return result;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => ENDPOINTS.USER.PROFILE,
      providesTags: ['UserProfile'],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (profileData) => ({
        url: ENDPOINTS.USER.EDIT,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['UserProfile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
