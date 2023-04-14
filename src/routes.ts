import MoviesPage from '@/components/movies/MoviesPage';
import BooksPage from '@/components/books/BooksPage';
import GamesPage from '@/components/games/GamesPage';
import ImportPage from '@/components/import/ImportPage';
import PreferencesPage from '@/components/preferences/PreferencesPage';
import NotFountPage from '@/components/NotFoundPage';

export const routes = [
  {
    path: '/',
    component: MoviesPage,
    pageProps: {
      pageId: 'movies',
      title: 'Movies'
    }
  },
  {
    path: '/books',
    component: BooksPage,
    pageProps: {
      pageId: 'books',
      title: 'Books'
    }
  },
  {
    path: '/games',
    component: GamesPage,
    pageProps: {
      pageId: 'games',
      title: 'Games'
    }
  },
  {
    path: '/import',
    component: ImportPage,
    pageProps: {
      pageId: 'import',
      title: 'Import'
    }
  },
  {
    path: '/preferences',
    component: PreferencesPage,
    pageProps: {
      pageId: 'preferences',
      title: 'Preferences'
    }
  },
  {
    path: '/*',
    component: NotFountPage,
    pageProps: {
      pageId: 'not_found',
      title: 'Page not found',
      public: true
    }
  }
];
