import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { simulateOTP, generateId } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isOtpSent: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || 'null'),
  isLoading: false,
  isOtpSent: false,
  error: null,
};

// Async thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phone, countryCode }: { phone: string; countryCode: string }) => {
    await simulateOTP();
    return { phone, countryCode };
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, countryCode, otp }: { phone: string; countryCode: string; otp: string }) => {
    if (otp.length !== 6) {
      throw new Error('Invalid OTP');
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const user: User = {
      id: generateId(),
      phone,
      countryCode,
      isAuthenticated: true,
    };
    
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isOtpSent = false;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    },
    resetOTP: (state) => {
      state.isOtpSent = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isOtpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isOtpSent = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Invalid OTP';
      });
  },
});

export const { logout, resetOTP, clearError } = authSlice.actions;
export default authSlice.reducer;