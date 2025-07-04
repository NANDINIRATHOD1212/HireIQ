import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = (() => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
})();

const initialState = {
  user: userFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user'); 
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
