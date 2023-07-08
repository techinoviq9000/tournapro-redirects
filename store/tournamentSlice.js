import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onGoingTournamentData: null,
  upComingTournamentData: null,
  tournamentDetails: null,
};

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setOnGoingTournamentData: (state, action) => {
      state.onGoingTournamentData = action.payload;
    },
    setUpComingTournamentData: (state, action) => {
      state.upComingTournamentData = action.payload;
    },
    setTournamentDetails: (state, action) => {
      state.tournamentDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOnGoingTournamentData,
  setUpComingTournamentData,
  setTournamentDetails,
} = tournamentSlice.actions;
export default tournamentSlice.reducer;
