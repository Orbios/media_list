import SORT_BY from '@/constants/sortBy';
import FILTER_BY from '@/constants/filterBy';

const exports = {
  getSortByOptions,
  getFilterByOptions
};

function getSortByOptions(entity: entityType): BasicOption[] {
  if (entity === 'movie') {
    return [
      {value: SORT_BY.TITLE, label: 'Title'},
      {value: SORT_BY.YEAR, label: 'Year'},
      {value: SORT_BY.RUNTIME, label: 'Movie runtime'}
    ];
  }

  return [{value: SORT_BY.TITLE, label: 'Title'}];
}

function getFilterByOptions(entity: entityType) {
  if (entity === 'movie') {
    return [
      {value: FILTER_BY.FINISHED, label: 'Watched'},
      {value: FILTER_BY.WISHLIST, label: 'Wishlist'},
      {value: FILTER_BY.ALL, label: 'All'}
    ];
  }

  return [
    {value: FILTER_BY.FINISHED, label: 'Read'},
    {value: FILTER_BY.WISHLIST, label: 'Wishlist'},
    {value: FILTER_BY.ALL, label: 'All'}
  ];
}

export default exports;
