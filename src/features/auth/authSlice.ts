import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth';

interface AuthState {
  user: User | null;
  /** 'idle' until the boot refresh resolves — routes must wait for this. */
  status: 'idle' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = { user: null, status: 'idle' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    signedOut: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;