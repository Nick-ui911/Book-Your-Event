import { createSlice } from "@reduxjs/toolkit";

const myEventSlice = createSlice({
  name: "myEvents",
  initialState: [],
  reducers: {
    setMyEvents: (state, action) => {
      return action.payload; // Replace the array with new events
    },
    addMyEvent: (state, action) => {
      state.push(action.payload); // Add a new event
    },
    clearMyEvents: () => {
      return []; // Reset to empty
    },
  },
});

export const { setMyEvents, addMyEvent, clearMyEvents } = myEventSlice.actions;
export default myEventSlice.reducer;
