import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teamDetails: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamDetails: (state, action) => {
      state.teamDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTeamDetails,
} = teamSlice.actions;
export default teamSlice.reducer;
