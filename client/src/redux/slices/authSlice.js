import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'employee',
  initialState: {
    isLoggedIn: localStorage.getItem('userLoggedIn') === 'true',
    user: null,
    role: localStorage.getItem('userRole') || null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.role = action.payload?.role;
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', action.payload?.role);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      localStorage.setItem('userLoggedIn', 'false');
      localStorage.removeItem('userRole');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
