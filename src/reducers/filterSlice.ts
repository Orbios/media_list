import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import SORT_BY from '@/constants/sortBy';
import FILTER_BY from '@/constants/filterBy';

interface FilterState {
  activePage: number;
  searchStr: string;
  sortAsc: boolean;
  sortBy: string;
  filterBy: number;
}

const initialState: FilterState = {
  activePage: 1,
  searchStr: '',
  sortAsc: true,
  sortBy: SORT_BY.TITLE,
  filterBy: FILTER_BY.FINISHED
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
    },
    setSearchStr: (state, action: PayloadAction<string>) => {
      state.searchStr = action.payload;
      state.activePage = 1;
    },
    setSortDirection: (state, action: PayloadAction<boolean>) => {
      state.sortAsc = action.payload;
      state.activePage = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.activePage = 1;
    },
    setFilterBy: (state, action: PayloadAction<number>) => {
      state.filterBy = action.payload;
      state.activePage = 1;
    },
    resetFilters: state => {
      state.activePage = 1;
      state.searchStr = '';
      state.sortAsc = true;
      state.sortBy = SORT_BY.TITLE;
      state.filterBy = FILTER_BY.FINISHED;
    }
  }
});

export const {setActivePage, setSearchStr, setSortDirection, setSortBy, setFilterBy, resetFilters} =
  filterSlice.actions;

export default filterSlice.reducer;
