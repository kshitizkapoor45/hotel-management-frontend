// Centralized API Base URLs
export const HOTEL_SERVICE_BASE_URL = 'http://localhost:8094/api/';

// Specific Endpoint Paths
export const ENDPOINTS = {
  HOTEL: {
    GET_ALL: 'hotel/public/all',
    GET_BY_ID: 'hotel/public/',
    REGISTER: 'hotel/register',
    EDIT: 'hotel/edit',
    FILE_UPLOAD: 'hotel/file-upload',
    RECOMMENDATIONS: 'hotel/recommendations',
  },
  USER: {
    PROFILE: 'user/profile',
    EDIT: 'user/edit',
    GET_ALL: 'user/',
  },
  RATING: {
    REGISTER: 'rating/register',
    GET_USER_RATINGS: 'rating/user',
  },
  AI: {
    SEARCH: 'ai/public/hotel-search',
  },
};
