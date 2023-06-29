import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player: null,
};

export const registerPlayerSlice = createSlice({
  name: "registerPlayer",
  initialState,
  reducers: {
    setPlayerDetails: (state, action) => {
      state.player = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setPlayerDetails } = registerPlayerSlice.actions;

export default registerPlayerSlice.reducer;
