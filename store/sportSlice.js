import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sportId: null,
};

export const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setSportId: (state, action) => {
      state.sportId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSportId,
} = sportSlice.actions;
export default sportSlice.reducer;
