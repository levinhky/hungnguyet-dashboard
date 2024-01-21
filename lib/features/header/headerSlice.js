import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "Dashboard",
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderTitle: (state, action) => {
      state.title += action.payload;
    },
  },
});

export const { setHeaderTitle } = headerSlice.actions;

export default headerSlice.reducer;
