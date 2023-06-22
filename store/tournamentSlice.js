import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ongoingdata: null,
  upcomingdata: null,
  ongoingTournamentDetails: null,
  upcomingTournamentDetails: null
};

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setongoingTournament: (state, action) => {
      state.ongoingdata = action.payload;
    },
    setupcomingTournament:(state, action) => {
      state.upcomingdata = action.payload;
    },
    setongoingTournamentDetails: (state, action) => {
      state.ongoingTournamentDetails = action.payload;
    },
    setupcomingTournamentDetails: (state, action) => {
      state.upcomingTournamentDetails = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setongoingTournament, setongoingTournamentDetails } = tournamentSlice.actions;
export const { setupcomingTournament, setupcomingTournamentDetails } = tournamentSlice.actions;
export default tournamentSlice.reducer;
