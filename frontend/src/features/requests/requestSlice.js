import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";


export const fetchRequests =
  createAsyncThunk(
    "requests/fetchAll",
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.get(
          "/requests",
          { params }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load requests"
        );
      }
    }
  );


export const fetchRequestById =
  createAsyncThunk(
    "requests/fetchOne",
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.get(
          `/requests/${id}`
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load request"
        );
      }
    }
  );


export const createRequest =
  createAsyncThunk(
    "requests/create",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await api.post(
          "/requests",
          formData
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create request"
        );
      }
    }
  );


export const updateRequest =
  createAsyncThunk(
    "requests/update",
    async (
      { id, formData },
      { rejectWithValue }
    ) => {
      try {
        const response = await api.patch(
          `/requests/${id}`,
          formData
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update request"
        );
      }
    }
  );


export const cancelRequest =
  createAsyncThunk(
    "requests/cancel",
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.patch(
          `/requests/${id}/cancel`
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to cancel request"
        );
      }
    }
  );


export const changeRequestStatus =
  createAsyncThunk(
    "requests/changeStatus",
    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {
        const response = await api.patch(
          `/requests/${id}/status`,
          { status }
        );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to change status"
        );
      }
    }
  );


const requestSlice = createSlice({
  name: "requests",

  initialState: {
    items: [],
    currentRequest: null,

    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },

    loading: false,
    actionLoading: false,
    error: null,
  },

  reducers: {
    clearRequestError: (state) => {
      state.error = null;
    },

    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchRequests.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchRequests.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload.data?.requests || [];

          state.pagination =
            action.payload.pagination ||
            state.pagination;
        }
      )

      .addCase(
        fetchRequests.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )


      .addCase(
        fetchRequestById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.currentRequest = null;
        }
      )

      .addCase(
        fetchRequestById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.currentRequest =
            action.payload.data?.request;
        }
      )

      .addCase(
        fetchRequestById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )


      .addCase(
        createRequest.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createRequest.fulfilled,
        (state) => {
          state.actionLoading = false;
        }
      )

      .addCase(
        createRequest.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )


      .addCase(
        updateRequest.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        updateRequest.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.currentRequest =
            action.payload.data?.request;
        }
      )

      .addCase(
        updateRequest.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )


      .addCase(
        cancelRequest.pending,
        (state) => {
          state.actionLoading = true;
        }
      )

      .addCase(
        cancelRequest.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.currentRequest =
            action.payload.data?.request;
        }
      )

      .addCase(
        cancelRequest.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      )


      .addCase(
        changeRequestStatus.pending,
        (state) => {
          state.actionLoading = true;
        }
      )

      .addCase(
        changeRequestStatus.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.currentRequest =
            action.payload.data?.request;
        }
      )

      .addCase(
        changeRequestStatus.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
        }
      );
  },
});


export const {
  clearRequestError,
  clearCurrentRequest,
} = requestSlice.actions;

export default requestSlice.reducer;