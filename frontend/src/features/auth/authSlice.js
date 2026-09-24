import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";


export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);


export const getCurrentUser =
  createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await api.get("/auth/me");

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Not authenticated"
        );
      }
    }
  );


export const logoutUser =
  createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
      try {
        await api.post("/auth/logout");

        return true;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Logout failed"
        );
      }
    }
  );


const initialState = {
  user: null,
  role: null,

  isAuthenticated: false,

  authChecked: false,

  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(
        loginUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;

          const user =
            action.payload.data?.user;

          state.user = user;
          state.role = user?.role || null;
          state.isAuthenticated = true;
          state.authChecked = true;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.authChecked = true;
        }
      )


      // REGISTER
      .addCase(
        registerUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        registerUser.fulfilled,
        (state, action) => {
          state.loading = false;

          const user =
            action.payload.data?.user;

          if (user) {
            state.user = user;
            state.role = user.role;
            state.isAuthenticated = true;
          }
        }
      )

      .addCase(
        registerUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )


      // GET CURRENT USER
      .addCase(
        getCurrentUser.pending,
        (state) => {
          state.authChecked = false;
        }
      )

      .addCase(
        getCurrentUser.fulfilled,
        (state, action) => {
          const user =
            action.payload.data?.user;

          state.user = user;
          state.role = user?.role || null;
          state.isAuthenticated = true;
          state.authChecked = true;
          state.error = null;
        }
      )

      .addCase(
        getCurrentUser.rejected,
        (state) => {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
          state.authChecked = true;
        }
      )


      // LOGOUT
      .addCase(
        logoutUser.fulfilled,
        (state) => {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
          state.authChecked = true;
        }
      );
  },
});


export const {
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;