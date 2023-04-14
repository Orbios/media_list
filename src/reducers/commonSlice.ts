import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ConfirmAction {
  title: string;
  text?: string;
  action: () => void;
}

interface AsyncActions {
  [key: string]: boolean;
}

interface CreateEntityAction {
  entity: entityType;
  action: (entity: Book | Movie) => void;
}

// Define a type for the slice state
interface CommonState {
  asyncActions: AsyncActions;
  confirmAction?: ConfirmAction;
  preferenceDir: string;
  newPreferenceDir: string;
  createEntityAction?: CreateEntityAction;
}

// Define the initial state using that type
const initialState: CommonState = {
  asyncActions: {},
  confirmAction: undefined,
  preferenceDir: '',
  newPreferenceDir: '',
  createEntityAction: undefined
};

export const commonSlice = createSlice({
  name: 'common',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    asyncActionStart: (state, action: PayloadAction<string>) => {
      state.asyncActions[action.payload] = true;
    },
    asyncActionEnd: (state, action: PayloadAction<string>) => {
      delete state.asyncActions[action.payload];
    },
    confirmAction: (state, action: PayloadAction<ConfirmAction>) => {
      state.confirmAction = action.payload;
    },
    confirmActionCancel: state => {
      state.confirmAction = undefined;
    },
    setPreferenceDir: (state, action: PayloadAction<string>) => {
      state.preferenceDir = action.payload;
    },
    setNewPreferenceDir: (state, action: PayloadAction<string>) => {
      state.newPreferenceDir = action.payload;
    },
    createEntityAction: (state, action: PayloadAction<CreateEntityAction>) => {
      state.createEntityAction = action.payload;
    },
    createEntityActionCancel: state => {
      state.createEntityAction = undefined;
    }
  }
});

export const {
  asyncActionStart,
  asyncActionEnd,
  confirmAction,
  confirmActionCancel,
  setPreferenceDir,
  setNewPreferenceDir,
  createEntityAction,
  createEntityActionCancel
} = commonSlice.actions;

export default commonSlice.reducer;
