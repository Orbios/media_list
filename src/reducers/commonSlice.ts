import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define a type for the slice state
interface CommonState {
  preferencesVisible: boolean;
  preferenceDir: string;
  newPreferenceDir: string;
}

// Define the initial state using that type
const initialState: CommonState = {
  preferencesVisible: false,
  preferenceDir: '',
  newPreferenceDir: ''
};

export const commonSlice = createSlice({
  name: 'common',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPreferenceDir: (state, action: PayloadAction<string>) => {
      state.preferenceDir = action.payload;
    },
    setNewPreferenceDir: (state, action: PayloadAction<string>) => {
      state.newPreferenceDir = action.payload;
    },
    togglePreferencesVisibility: state => {
      state.preferencesVisible = !state.preferencesVisible;
    }
  }
});

export const {setPreferenceDir, setNewPreferenceDir, togglePreferencesVisibility} = commonSlice.actions;

export default commonSlice.reducer;
