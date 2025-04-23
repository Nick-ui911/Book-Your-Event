import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: [],
  reducers: {
    setEvents: (state, action) => {
      return action.payload;
    },
    clearEvents: () => {
      return [];
    },
  },
});

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
