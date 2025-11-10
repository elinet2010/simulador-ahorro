import { configureStore } from '@reduxjs/toolkit';
import simulatorReducer from './slices/simulatorSlice';
import onboardingReducer from './slices/onboardingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      simulator: simulatorReducer,
      onboarding: onboardingReducer,
    },
  });
};

// Inferir los tipos del store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

