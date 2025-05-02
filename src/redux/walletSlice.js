import { createSlice } from "@reduxjs/toolkit";

const myWalletSlice = createSlice({
  name: "wallet",
  initialState: [],
  reducers: {
    setWalletData: (state, action) => {
      return action.payload; // Replace the array with new events
    },
    clearWalletData: () => {
      return []; // Reset to empty
    },
  },
});

export const { setWalletData,clearWalletData } = myWalletSlice.actions;
export default myWalletSlice.reducer;
