import { configureStore } from '@reduxjs/toolkit'
import packagesReducer from "../packages/packagesSlice"
import servicesReducer from '../services/serviceSlice'

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    packages: packagesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
