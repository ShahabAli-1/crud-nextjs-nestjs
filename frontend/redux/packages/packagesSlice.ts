// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// import api from '../api/api'
// import { IPackage, IPackageInput } from '../types'

// // Define the initial state using that type
// interface PackagesState {
//   packages: IPackage[]
//   status: 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: string | null
// }

// const initialState: PackagesState = {
//   packages: [],
//   status: 'idle',
//   error: null,
// }

// // Fetch all packages
// export const fetchPackages = createAsyncThunk('packages/fetchPackages', async () => {
//   const response = await api.get<IPackage[]>('/packages')
//   return response.data
// })

// // Create a new package
// export const createPackage = createAsyncThunk('packages/createPackage', async (packageData: IPackageInput) => {
//   const response = await api.post<IPackage>('/packages', packageData)
//   return response.data
// })

// // Update an existing package
// export const updatePackage = createAsyncThunk('packages/updatePackage', async ({ id, data }: { id: string; data: IPackageInput }) => {
//   const response = await api.put<IPackage>(`/packages/${id}`, data)
//   return response.data
// })

// // Delete a package
// export const deletePackage = createAsyncThunk('packages/deletePackage', async (id: string) => {
//   await api.delete(`/packages/${id}`)
//   return id
// })

// // Slice
// const packagesSlice = createSlice({
//   name: 'packages',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Packages
//       .addCase(fetchPackages.pending, (state) => {
//         state.status = 'loading'
//       })
//       .addCase(fetchPackages.fulfilled, (state, action: PayloadAction<IPackage[]>) => {
//         state.status = 'succeeded'
//         state.packages = action.payload
//       })
//       .addCase(fetchPackages.rejected, (state, action) => {
//         state.status = 'failed'
//         state.error = action.error.message || 'Failed to fetch packages'
//       })
//       // Create Package
//       .addCase(createPackage.fulfilled, (state, action: PayloadAction<IPackage>) => {
//         state.packages.push(action.payload)
//       })
//       // Update Package
//       .addCase(updatePackage.fulfilled, (state, action: PayloadAction<IPackage>) => {
//         const index = state.packages.findIndex(pkg => pkg._id === action.payload._id)
//         if (index !== -1) {
//           state.packages[index] = action.payload
//         }
//       })
//       // Delete Package
//       .addCase(deletePackage.fulfilled, (state, action: PayloadAction<string>) => {
//         state.packages = state.packages.filter(pkg => pkg._id !== action.payload)
//       })
//   },
// })

// export default packagesSlice.reducer

// // src/redux/packages/packagesSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import api from "../api/api";
// import { IPackage, IPackageInput } from "../types";

// // Define the initial state using that type
// interface PackagesState {
//   packages: IPackage[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: PackagesState = {
//   packages: [],
//   status: "idle",
//   error: null,
// };

// // Fetch all packages
// export const fetchPackages = createAsyncThunk<
//   IPackage[],
//   void,
//   { rejectValue: string }
// >("packages/fetchPackages", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get<IPackage[]>("/packages");
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to fetch packages"
//     );
//   }
// });

// // Create a new package
// export const createPackage = createAsyncThunk<
//   IPackage,
//   IPackageInput,
//   { rejectValue: string }
// >("packages/createPackage", async (packageData, { rejectWithValue }) => {
//   try {
//     const response = await api.post<IPackage>("/packages", packageData);
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to create package."
//     );
//   }
// });

// // Update an existing package
// export const updatePackage = createAsyncThunk<
//   IPackage,
//   { id: string; data: IPackageInput },
//   { rejectValue: string }
// >("packages/updatePackage", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const response = await api.put<IPackage>(`/packages/${id}`, data);
//     return response.data;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to update package."
//     );
//   }
// });

// // Delete a package
// export const deletePackage = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("packages/deletePackage", async (id, { rejectWithValue }) => {
//   try {
//     await api.delete(`/packages/${id}`);
//     return id;
//   } catch (err: any) {
//     return rejectWithValue(
//       err.response?.data?.message || "Failed to delete package."
//     );
//   }
// });

// // Slice
// const packagesSlice = createSlice({
//   name: "packages",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Packages
//       .addCase(fetchPackages.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchPackages.fulfilled,
//         (state, action: PayloadAction<IPackage[]>) => {
//           state.status = "succeeded";
//           state.packages = action.payload;
//         }
//       )
//       .addCase(fetchPackages.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to fetch packages";
//       })
//       // Create Package
//       .addCase(
//         createPackage.fulfilled,
//         (state, action: PayloadAction<IPackage>) => {
//           state.packages.push(action.payload);
//         }
//       )
//       .addCase(createPackage.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to create package";
//       })
//       // Update Package
//       .addCase(
//         updatePackage.fulfilled,
//         (state, action: PayloadAction<IPackage>) => {
//           const index = state.packages.findIndex(
//             (pkg) => pkg._id === action.payload._id
//           );
//           if (index !== -1) {
//             state.packages[index] = action.payload;
//           }
//         }
//       )
//       .addCase(updatePackage.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to update package";
//       })
//       // Delete Package
//       .addCase(
//         deletePackage.fulfilled,
//         (state, action: PayloadAction<string>) => {
//           state.packages = state.packages.filter(
//             (pkg) => pkg._id !== action.payload
//           );
//         }
//       )
//       .addCase(deletePackage.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to delete package";
//       });
//   },
// });

// export default packagesSlice.reducer;

// src/redux/packages/packagesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";
import { IPackage, IPackageInput } from "../types";

// Define the initial state using that type
interface PackagesState {
  packages: IPackage[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: PackagesState = {
  packages: [],
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
};

// Fetch all packages
export const fetchPackages = createAsyncThunk<
  IPackage[],
  void,
  { rejectValue: string }
>("packages/fetchPackages", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<IPackage[]>("/packages");
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch packages"
    );
  }
});

// Create a new package
export const createPackage = createAsyncThunk<
  IPackage,
  IPackageInput,
  { rejectValue: string }
>("packages/createPackage", async (packageData, { rejectWithValue }) => {
  try {
    const response = await api.post<IPackage>("/packages", packageData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create package."
    );
  }
});

// Update an existing package
export const updatePackage = createAsyncThunk<
  IPackage,
  { id: string; data: IPackageInput },
  { rejectValue: string }
>("packages/updatePackage", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<IPackage>(`/packages/${id}`, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update package."
    );
  }
});

// Delete a package
export const deletePackage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("packages/deletePackage", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/packages/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete package."
    );
  }
});

// Slice
const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Packages
      .addCase(fetchPackages.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(
        fetchPackages.fulfilled,
        (state, action: PayloadAction<IPackage[]>) => {
          state.fetchStatus = "succeeded";
          state.packages = action.payload;
        }
      )
      .addCase(fetchPackages.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || "Failed to fetch packages";
      })
      // Create Package
      .addCase(createPackage.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(
        createPackage.fulfilled,
        (state, action: PayloadAction<IPackage>) => {
          state.createStatus = "succeeded";
          state.packages.push(action.payload);
        }
      )
      .addCase(createPackage.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create package";
      })
      // Update Package
      .addCase(updatePackage.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(
        updatePackage.fulfilled,
        (state, action: PayloadAction<IPackage>) => {
          state.updateStatus = "succeeded";
          const index = state.packages.findIndex(
            (pkg) => pkg._id === action.payload._id
          );
          if (index !== -1) {
            state.packages[index] = action.payload;
          }
        }
      )
      .addCase(updatePackage.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update package";
      })
      // Delete Package
      .addCase(deletePackage.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(
        deletePackage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteStatus = "succeeded";
          state.packages = state.packages.filter(
            (pkg) => pkg._id !== action.payload
          );
        }
      )
      .addCase(deletePackage.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete package";
      });
  },
});

export default packagesSlice.reducer;
