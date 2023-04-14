import axios from 'axios';

import notificationHelper from '@/helpers/notificationHelper';
import validationHelper from '@/helpers/validationHelper';

const exports = {
  searchBooks
};

/* Print Type
  You can use the printType parameter to restrict the returned results to a specific print or publication type by setting it to one of the following values:

  all - Does not restrict by print type (default).
  books - Returns only results that are books.
  magazines - Returns results that are magazines. */

const PRINT_TYPE = 'books';

// how to apply search parameters - https://developers.google.com/books/docs/v1/using#st_params
async function searchBooks(
  searchStr: string,
  activePage: number
): Promise<{total: number; books: GoogleBook[]} | undefined> {
  try {
    const isValidISBNCode = validationHelper.isValidISBNCode(searchStr);

    // To search for an exact phrase, enclose the phrase in quotation marks: q="exact phrase".
    const query = isValidISBNCode ? `isbn:${searchStr}` : `"${searchStr}"`;

    // startIndex - The position in the collection at which to start. The index of the first item is 0.
    // maxResults - The maximum number of results to return. The default is 10, and the maximum allowable value is 40.
    let startIndex = 0;
    if (activePage > 1) startIndex = (activePage - 1) * 10;

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&printType=${PRINT_TYPE}&startIndex=${startIndex}`
    );

    const books: GoogleBook[] = response.data.items?.map((book: any) => {
      return {
        ...book,
        googleId: book.id,
        id: undefined
      };
    });

    return {
      total: response.data.totalItems,
      books
    };
  } catch (err) {
    console.log(err);
    notificationHelper.error('Error while searching books by title!');
  }
}

export default exports;
