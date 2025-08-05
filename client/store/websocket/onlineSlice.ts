import { createSlice } from "@reduxjs/toolkit";

export interface ChatState {
  onlineUsers: string[];
}

const initialState: ChatState = {
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "onlioneUsers",
  initialState,
  reducers: {
    // actions
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});
export const { setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;
