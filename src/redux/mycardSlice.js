import { createSlice } from "@reduxjs/toolkit";

const mycardSlice = createSlice({
  name: "card",
  initialState: [],
  reducers: {
    setCards: (state, action) => {
      return action.payload;
    },
    clearCards: () => {
      return [];
    },
  },
});

export const { setCards, clearCards } = mycardSlice.actions;
export default mycardSlice.reducer;
