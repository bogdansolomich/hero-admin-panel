import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';
// import HeroesFilters from './HeroesFilters';

const filtersAdapter = createEntityAdapter();

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: 'idle',
//   activeFilter: 'all',
// };

const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all',
});
export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async () => {
    const { request } = useHttp();
    return await request('http://localhost:3001/filters');
  }
);

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // filtersFetching: state => {
    //   state.filtersLoadingStatus = 'loading';
    // },
    // filtersFetched: (state, action) => {
    //   state.filtersLoadingStatus = 'idle';
    //   state.filters = action.payload;
    // },
    // filtersFetchingError: state => {
    //   state.filtersLoadingStatus = 'error';
    // },
    filtersChanged: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFilters.pending, state => {
        state.filtersLoadingStatus = 'loading';
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filtersLoadingStatus = 'idle';
        // state.filters = action.payload;
        filtersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilters.rejected, state => {
        state.filtersLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = filterSlice;

export default reducer;

export const { selectAll } = filtersAdapter.getSelectors(
  state => state.filters
);
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  filtersChanged,
} = actions;
