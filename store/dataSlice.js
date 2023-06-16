import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: null,
};

export const dataSlice = createSlice({
  name: "generalData",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLocation } = dataSlice.actions;

export default dataSlice.reducer;
