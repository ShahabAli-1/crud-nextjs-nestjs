import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";
import { IService } from "../types";

// Define the initial state using that type
interface ServicesState {
  services: IService[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  status: "idle",
  error: null,
};

// Async Thunks

// Fetch all services
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async () => {
    const response = await api.get<IService[]>("/services");
    return response.data;
  }
);

interface ServiceData {
  name: string;
  description: string;
  price: number;
}
export const createService = createAsyncThunk<
  IService, // Return type
  ServiceData, // Argument type
  { rejectValue: string } // Rejected action payload type
>("services/createService", async (serviceData, { rejectWithValue }) => {
  try {
    const response = await api.post<IService>("/services", serviceData);
    return response.data;
  } catch (err: any) {
    // Reject the promise with a custom error message
    return rejectWithValue(
      err.response?.data?.message || "Failed to create service."
    );
  }
});

// Update an existing service
export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, data }: { id: string; data: Partial<IService> }) => {
    const response = await api.put<IService>(`/services/${id}`, data);
    return response.data;
  }
);

// Delete a service
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/services/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Service could not be deleted"
      );
    }
  }
);

// Slice
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchServices.fulfilled,
        (state, action: PayloadAction<IService[]>) => {
          state.status = "succeeded";
          state.services = action.payload;
        }
      )
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch services";
      })
      // Create Service
      .addCase(
        createService.fulfilled,
        (state, action: PayloadAction<IService>) => {
          state.services.push(action.payload);
        }
      )
      // Update Service
      .addCase(
        updateService.fulfilled,
        (state, action: PayloadAction<IService>) => {
          const index = state.services.findIndex(
            (service) => service._id === action.payload._id
          );
          if (index !== -1) {
            state.services[index] = action.payload;
          }
        }
      )
      // Delete Service
      .addCase(
        deleteService.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.services = state.services.filter(
            (service) => service._id !== action.payload
          );
        }
      )
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default servicesSlice.reducer;
