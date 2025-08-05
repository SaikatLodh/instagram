import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../src/types";
export interface NotificationState {
  notifications: NotificationType[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationType>) {
      if (action.payload.type === "like") {
        state.notifications.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload._id
        );
      }
    },
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
