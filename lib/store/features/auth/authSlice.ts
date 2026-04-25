import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
}

// Set initial state to null for SSR compatibility
// State will be hydrated from localStorage on the client by the useAuth hook or a sync component
const initialState: AuthState = {
  token: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; userId: string }>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('token', action.payload.token);
        window.localStorage.setItem('userId', action.payload.userId);
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.userId = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('userId');
      }
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;