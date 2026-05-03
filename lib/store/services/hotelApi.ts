import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { HOTEL_SERVICE_BASE_URL, ENDPOINTS } from '../endpoints';
import { getAccessTokenValue } from '../features/auth/authTokenProvider';
import keycloak from '../features/auth/keycloak';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  about: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  aiSummary?: string;
  aiHighlights?: string[];
  aiSentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CreateHotelRequest {
  name: string;
  location: string;
  about: string;
  amenities: string[];
  imageUrl?: string;
}

export interface UpdateHotelRequest extends CreateHotelRequest {
  id: string;
}

export interface FileUploadResponse {
  message: string;
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
    // Only attempt refresh if we think we are logged in
    if (keycloak.authenticated) {
      console.warn('401 detected → trying token refresh');
      try {
        // Attempt to refresh the token if it's expired
        await keycloak.updateToken(30);
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } catch (err) {
        console.error('Refresh failed → logout');
        keycloak.logout();
      }
    }
  }

  return result;
};

export const hotelApi = createApi({
  reducerPath: 'hotelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Hotel'],
  endpoints: (builder) => ({
    getHotels: builder.query<Hotel[], void>({
      query: () => ENDPOINTS.HOTEL.GET_ALL,
      providesTags: ['Hotel'],
      transformResponse: (response: any) => {
        if (!Array.isArray(response)) return [];
        return response.map((item: any) => {
          const hotel = item?.hotel || item;
          const ratings = item?.ratings || [];
          const totalRating = ratings.reduce((sum: number, r: any) => sum + (r?.rating || 0), 0);
          const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;

          return {
            ...hotel,
            rating: parseFloat(avgRating.toFixed(1)),
            reviewCount: ratings.length,
          };
        });
      },
    }),
    getRecommendations: builder.query<Hotel[], void>({
      query: () => ENDPOINTS.HOTEL.RECOMMENDATIONS,
      providesTags: ['Hotel'],
      transformResponse: (response: any) => {
        if (!Array.isArray(response)) return [];
        return response.map((item: any) => {
          const hotel = item?.hotel || item;
          const ratings = item?.ratings || [];
          const totalRating = ratings.reduce((sum: number, r: any) => sum + (r?.rating || 0), 0);
          const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;

          return {
            ...hotel,
            rating: parseFloat(avgRating.toFixed(1)),
            reviewCount: ratings.length,
          };
        });
      },
    }),
    registerHotel: builder.mutation<Hotel, CreateHotelRequest>({
      query: (newHotel) => ({
        url: ENDPOINTS.HOTEL.REGISTER,
        method: 'POST',
        body: newHotel,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation<Hotel, UpdateHotelRequest>({
      query: (updatedHotel) => ({
        url: ENDPOINTS.HOTEL.EDIT,
        method: 'PUT',
        body: updatedHotel,
      }),
      invalidatesTags: ['Hotel'],
    }),
    uploadHotelImage: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: ENDPOINTS.HOTEL.FILE_UPLOAD,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetRecommendationsQuery,
  useRegisterHotelMutation,
  useUpdateHotelMutation,
  useUploadHotelImageMutation
} = hotelApi;