import {isEmpty} from 'lodash';

import SORT_BY from '@/constants/sortBy';

import utils from '@/helpers/utils';
import storageHelper from '@/services/storageHelper';

const exports = {
  getBooks,
  getAllBooks,
  getGenres,
  addGenres,
  getBookLists,
  saveBook,
  deleteBook
};

let jsondata: any = null;
async function getData() {
  if (!jsondata) {
    jsondata = await storageHelper.readData();
  }
  return jsondata;
}

async function saveData() {
  const data = await getData();
  if (!data) return;
  await storageHelper.saveData(data);
}

async function getBooks(page: number, sortBy: string, searchStr: string, sortAsc: boolean, filterBy: number) {
  const mappedBooks = await getAllBooks();

  const books = searchBooks(mappedBooks, searchStr, filterBy);

  sortBooks(books, sortBy, sortAsc);

  const result = utils.getItemsPerPage(books, page);

  return Promise.resolve({
    total: books.length,
    dataItems: result
  });
}

async function getAllBooks(): Promise<Book[]> {
  const data = await getData();
  const books = data.books.items;

  return books;
}

async function getGenres() {
  const data = await getData();
  return data.books.genres.sort();
}

async function addGenres(bookGenres: string[]): Promise<boolean> {
  let isUpdated = false;

  if (isEmpty(bookGenres)) return isUpdated;

  console.log('Original categories: ', bookGenres);

  const genres = await getGenres();

  bookGenres.forEach(genre => {
    if (!genres.includes(genre)) {
      genres.push(genre);
      isUpdated = true;
    }
  });

  if (isUpdated) await saveData();

  return isUpdated;
}

async function getBookLists() {
  const data = await getData();
  return data.books.lists;
}

function saveBook(book: Book) {
  if (book.id) return updateBook(book);

  return addBook(book);
}

async function updateBook(book: any) {
  const data = await getData();
  const books = data.books.items;

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === book.id) {
      books[i] = book;
    }
  }

  return saveData();
}

async function addBook(book: any) {
  const data = await getData();
  const books = data.books.items;

  let maxId = 0;

  for (let i = 0; i < books.length; i++) {
    if (books[i].id > maxId) {
      maxId = books[i].id;
    }
  }

  book.id = maxId + 1;

  books.push(book);

  return saveData();
}

async function deleteBook(id: number) {
  const data = await getData();
  const books = data.books.items;

  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books.splice(i, 1);
    }
  }

  return saveData();
}

// helper methods

function searchBooks(books: Book[], searchStr: string, filterBy: number) {
  if (filterBy) {
    books = books.filter((book: Book) => {
      return book?.lists?.includes(filterBy);
    });
  }

  if (!searchStr) return books;

  const textSearchFields: string[] = [
    'title',
    'alternativeTitle',
    'subtitle',
    'authors',
    'publishedDate',
    'description'
  ];

  return books.filter((book: any) => {
    for (const field of textSearchFields) {
      const bookField = book[field];
      if (!bookField) continue;

      if (utils.containsString(bookField, searchStr)) return true;
    }

    for (const genre of book.genres) {
      if (utils.containsString(genre, searchStr)) return true;
    }

    return false;
  });
}

function sortBooks(books: Book[], sortBy: string, isAsc: boolean) {
  const dirNum = isAsc ? 1 : -1;

  if (sortBy === SORT_BY.TITLE) {
    books.sort((x, y) => x.title.localeCompare(y.title) * dirNum);
  }

  if (sortBy === SORT_BY.PUBLISHED_DATE) {
    books.sort((x: any, y: any) => (x.publishedDate - y.publishedDate) * dirNum);
  }
}

export default exports;
