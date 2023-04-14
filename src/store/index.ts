import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';

import commonReducer from '@/reducers/commonSlice';
import filterReducer from '@/reducers/filterSlice';

export const store = configureStore({
  reducer: {
    common: commonReducer,
    filter: filterReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
