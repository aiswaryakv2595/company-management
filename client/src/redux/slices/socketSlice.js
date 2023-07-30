import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    callAccepted: false,
    callEnded: false,
    stream: null,
    name: '',
    call: {},
    me: '',
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setCallAccepted: (state, action) => {
      state.callAccepted = action.payload;
    },
    setCallEnded: (state, action) => {
      state.callEnded = action.payload;
    },
    setStream: (state, action) => {
      state.stream = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setCall: (state, action) => {
      state.call = action.payload;
    },
    setMe: (state, action) => {
      state.me = action.payload;
    },
  },
});

export const {
  setSocket,
  setCallAccepted,
  setCallEnded,
  setStream,
  setName,
  setCall,
  setMe,
} = socketSlice.actions;

export default socketSlice.reducer;
