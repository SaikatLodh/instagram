import { createSlice } from "@reduxjs/toolkit";

export interface SocketState {
  socket: boolean | null;
}

const initialState: SocketState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socketio",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});
export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
