import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { hotelApi } from './services/hotelApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [hotelApi.reducerPath]: hotelApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(hotelApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
