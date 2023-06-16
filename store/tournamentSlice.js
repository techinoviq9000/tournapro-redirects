import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  tournamentDetails: null
};

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setTournament: (state, action) => {
      state.data = action.payload;
    },
    setTournamentDetails: (state, action) => {
      state.tournamentDetails = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setTournament, setTournamentDetails } = tournamentSlice.actions;

export default tournamentSlice.reducer;
