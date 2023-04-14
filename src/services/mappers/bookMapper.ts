import {find} from 'lodash';

import formatHelper from '@/helpers/formatHelper';

const exports = {
  getDefaultCustomBook,
  mapGoogleBookToBook,
  mapBooks
};

function getDefaultCustomBook(): Book {
  const customBook: Book = {
    id: 0,
    googleId: '',
    title: '',
    alternativeTitle: '',
    subtitle: '',
    description: '',
    authors: [],
    genres: [],
    publishedDate: 2020,
    pageCount: 0,
    language: 'ru',
    posterUrl: '',
    lists: []
  };

  return customBook;
}

function mapGoogleBookToBook(googleBook: GoogleBook) {
  const volumeInfo = googleBook.volumeInfo;

  const book: Book = {
    id: 0,
    googleId: googleBook.googleId,
    selfLink: googleBook.selfLink,
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle,
    description: volumeInfo.description,
    authors: volumeInfo.authors,
    genres: volumeInfo.categories,
    publishedDate: formatHelper.getYearFromDate(volumeInfo.publishedDate),
    pageCount: Number(volumeInfo.pageCount),
    language: volumeInfo.language,
    posterUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
    lists: [1] //read
  };

  return book;
}

function mapBooks(books: GoogleBook[], allBooks: Book[]): GoogleBook[] {
  const mappedBooks = books.map(googleBook => {
    const bookInDb: Book | undefined = find(
      allBooks,
      (book: Book) =>
        book.googleId === googleBook.googleId ||
        (book.title === googleBook.volumeInfo.title &&
          book.publishedDate.toString() === googleBook.volumeInfo.publishedDate)
    );

    if (bookInDb) googleBook.id = bookInDb.id;

    return googleBook;
  });

  return mappedBooks;
}

export default exports;
