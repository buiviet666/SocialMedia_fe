import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number | string;
  name: string;
}

interface AuthState {
  user: User | null;
}

const loadUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUser(),
};

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");

      // Xóa token cả ở localStorage và sessionStorage
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
