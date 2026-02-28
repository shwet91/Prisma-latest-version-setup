import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  image: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set all user details at once (on login)
    setUser: (state, action: PayloadAction<Omit<UserState, "isLoggedIn">>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.isLoggedIn = true;
    },

    // Update specific user fields
    updateUser: (
      state,
      action: PayloadAction<Partial<Omit<UserState, "isLoggedIn">>>,
    ) => {
      if (action.payload.id !== undefined) state.id = action.payload.id;
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.email !== undefined)
        state.email = action.payload.email;
      if (action.payload.image !== undefined)
        state.image = action.payload.image;
    },

    // Clear all user details (on logout)
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.image = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
