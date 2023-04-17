import SORT_BY from '@/constants/sortBy';
import FILTER_BY from '@/constants/filterBy';

const exports = {
  getSortByOptions,
  getFilterByOptions
};

function getSortByOptions(entity: entityType): BasicOption[] {
  switch (entity) {
    case 'book':
      return [{value: SORT_BY.TITLE, label: 'Title'}];

    case 'movie':
      return [
        {value: SORT_BY.TITLE, label: 'Title'},
        {value: SORT_BY.YEAR, label: 'Year'},
        {value: SORT_BY.RUNTIME, label: 'Movie runtime'}
      ];

    case 'game':
      return [
        {value: SORT_BY.TITLE, label: 'Title'},
        {value: SORT_BY.RELEASE_DATE, label: 'Released'},
        {value: SORT_BY.RATING, label: 'Rating'}
      ];

    default:
      return [];
  }
}

function getFilterByOptions(entity: entityType): any[] {
  switch (entity) {
    case 'book':
      return [
        {value: FILTER_BY.FINISHED, label: 'Read'},
        {value: FILTER_BY.WISHLIST, label: 'Wishlist'},
        {value: FILTER_BY.ALL, label: 'All'}
      ];

    case 'movie':
      return [
        {value: FILTER_BY.FINISHED, label: 'Watched'},
        {value: FILTER_BY.WISHLIST, label: 'Wishlist'},
        {value: FILTER_BY.ALL, label: 'All'}
      ];

    case 'game':
      return [
        {value: FILTER_BY.FINISHED, label: 'Played'},
        {value: FILTER_BY.WISHLIST, label: 'Wishlist'},
        {value: FILTER_BY.ALL, label: 'All'}
      ];
    default:
      return [];
  }
}

export default exports;
