import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface OnboardingFormData {
  name: string;
  document: string;
  email: string;
  recaptchaToken: string;
}

export interface OnboardingResponse {
  success: boolean;
  requestCode?: string;
  message?: string;
  error?: string;
}

interface OnboardingState {
  loading: boolean;
  success: boolean;
  error: string | null;
  requestCode: string | null;
}

const initialState: OnboardingState = {
  loading: false,
  success: false,
  error: null,
  requestCode: null,
};

// Async thunk para enviar el formulario de onboarding
export const submitOnboarding = createAsyncThunk(
  'onboarding/submit',
  async (data: OnboardingFormData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.error || 'Error al enviar el formulario');
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Error de conexión'
      );
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    resetOnboarding: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.requestCode = action.payload.requestCode || null;
        state.error = null;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Error al enviar el formulario';
        state.requestCode = null;
      });
  },
});

export const { resetOnboarding, clearError } = onboardingSlice.actions;
export default onboardingSlice.reducer;


