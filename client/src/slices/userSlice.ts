import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  jwt?: string;
}

const initialState: UserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    logout() {
      return {};
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
