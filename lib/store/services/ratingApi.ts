import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { HOTEL_SERVICE_BASE_URL, ENDPOINTS } from '../endpoints';
import { getAccessTokenValue } from '../features/auth/authTokenProvider';
import keycloak from '../features/auth/keycloak';

export interface RatingRequest {
  hotelId: string;
  rating: number;
  feedback: string;
}

export interface RatingResponse {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  feedback: string;
}

export interface UserRatingResponse {
  rating: RatingResponse;
  hotel: {
    id: string;
    location: string;
    name: string;
    amenities: string[];
    imageUrl: string;
    about: string;
  };
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
    if (keycloak.authenticated) {
      console.warn('401 detected → trying token refresh');
      try {
        await keycloak.updateToken(30);
        result = await baseQuery(args, api, extraOptions);
      } catch (err) {
        console.error('Refresh failed → logout');
        keycloak.logout();
      }
    }
  }

  return result;
};

export const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Rating'],
  endpoints: (builder) => ({
    createRating: builder.mutation<RatingResponse, RatingRequest>({
      query: (newRating) => ({
        url: ENDPOINTS.RATING.REGISTER,
        method: 'POST',
        body: newRating,
      }),
      invalidatesTags: ['Rating'],
    }),
    getUserRatings: builder.query<UserRatingResponse[], void>({
      query: () => ENDPOINTS.RATING.GET_USER_RATINGS,
      providesTags: ['Rating'],
    }),
  }),
});

export const { useCreateRatingMutation, useGetUserRatingsQuery } = ratingApi;
