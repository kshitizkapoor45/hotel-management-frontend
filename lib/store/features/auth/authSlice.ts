import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  roles: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: typeof window !== 'undefined' ? localStorage.getItem('userId') : null,
  roles: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('roles') || '[]')
    : [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ userId: string; roles: string[] }>
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.roles = action.payload.roles;

      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', action.payload.userId);
        localStorage.setItem('roles', JSON.stringify(action.payload.roles));
      }
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.roles = [];

      if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;