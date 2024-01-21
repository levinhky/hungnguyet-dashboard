import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./features/header/headerSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      header: headerSlice,
    },
  });
};
