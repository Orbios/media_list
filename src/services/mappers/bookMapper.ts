import {find} from 'lodash';

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
        (book.title === googleBook.volumeInfo.title && book.authors[0] === googleBook.volumeInfo.authors[0])
    );

    if (bookInDb) googleBook.id = bookInDb.id;

    return googleBook;
  });

  return mappedBooks;
}

export default exports;
