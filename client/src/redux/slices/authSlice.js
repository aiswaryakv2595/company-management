import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'emoloyee',
  initialState: {
    isLoggedIn: sessionStorage.getItem('userLoggedIn') === 'true',
    user: null,
    role:null
  },
  reducers: {
   
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.role = action.payload.role;
      sessionStorage.setItem('userLoggedIn', 'true');
    },
    
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      sessionStorage.setItem('userLoggedIn', 'false');
    },
  },
});

export const {
    login,
  logout,
} = authSlice.actions;


export default authSlice.reducer;
