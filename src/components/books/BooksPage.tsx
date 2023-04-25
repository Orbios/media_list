import {useState, useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {confirmAction, createEntityAction} from '@/reducers/commonSlice';

import notificationHelper from '@/helpers/notificationHelper';

import bookServiceStubs from '@/services/bookServiceStubs';

import PageWrapper from '@/components/common/PageWrapper';
import Counter from '@/components/common/Counter';
import FilterBar from '@/components/common/FilterBar';

import EditBook from './components/EditBook';
import BookList from './components/BookList';

function BooksPage() {
  const dispatch = useAppDispatch();

  const activePage = useAppSelector(state => state.filter.activePage);
  const searchStr = useAppSelector(state => state.filter.searchStr);
  const sortAsc = useAppSelector(state => state.filter.sortAsc);
  const sortBy = useAppSelector(state => state.filter.sortBy);
  const filterBy = useAppSelector(state => state.filter.filterBy);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [bookLists, setBookLists] = useState<List[]>([]);

  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  useEffect(() => {
    loadGenres();
    loadBookLists();
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, activePage, searchStr, sortAsc, filterBy]);

  async function loadGenres() {
    const genresList = await bookServiceStubs.getGenres();
    setGenres(genresList);
  }

  async function loadBookLists() {
    const lists = await bookServiceStubs.getBookLists();
    setBookLists(lists);
  }

  async function loadBooks() {
    const response = await bookServiceStubs.getBooks(activePage, sortBy, searchStr, sortAsc, filterBy);

    setBooks(response.dataItems);
    setTotal(response.total);
  }

  async function addNewBookAction() {
    await dispatch(
      createEntityAction({
        entity: 'book',
        action: async entity => await onCreateBook(entity)
      })
    );
  }

  async function onCreateBook(entity: Book | Movie | Game) {
    const book = entity as Book;

    // 1. Check if genres exist in the database and add them if not
    const genresWereUpdated = await bookServiceStubs.addGenres(book.genres);

    // 2. If genres were updated, reload the genres list
    if (genresWereUpdated) await loadGenres();

    // 3. Open the edit book modal
    setBookToEdit(book);
  }

  function onEditBook(book: Book) {
    setBookToEdit(book);
  }

  function cancelEditBook() {
    setBookToEdit(null);
  }
  function updateBookState(field: string, value: any) {
    if (!bookToEdit) return;
    setBookToEdit({...bookToEdit, [field]: value});
  }

  async function saveBook() {
    if (!bookToEdit) return;

    await bookServiceStubs.saveBook(bookToEdit);

    notificationHelper.message('Book was saved');

    await loadBooks();

    cancelEditBook();
  }

  async function confirmDeleteBook(id: number) {
    await dispatch(
      confirmAction({
        title: 'Delete book',
        action: () => deleteBook(id)
      })
    );
  }

  async function deleteBook(id: number) {
    if (!id) return;

    await bookServiceStubs.deleteBook(id);

    notificationHelper.message('Book was deleted');

    await loadBooks();
  }

  async function updateBookPoster(bookId: number, posterUrl: string) {
    if (!bookId) return;

    await bookServiceStubs.updateBookPoster(bookId, posterUrl);

    notificationHelper.message('Book poster was updated');

    await loadBooks();
  }

  function render() {
    const editBookVisible = bookToEdit ? true : false;

    return (
      <PageWrapper>
        <FilterBar total={total} entity="book" addNewEntityAction={addNewBookAction} />

        <Counter total={total} title="Books" />

        <BookList
          books={books}
          confirmDeleteBook={confirmDeleteBook}
          onEditBook={onEditBook}
          onUpdatePoster={updateBookPoster}
        />

        {editBookVisible && bookToEdit && (
          <EditBook
            visible={editBookVisible}
            genres={genres}
            book={bookToEdit}
            lists={bookLists}
            onChange={updateBookState}
            close={cancelEditBook}
            save={saveBook}
          />
        )}
      </PageWrapper>
    );
  }

  return render();
}

export default BooksPage;
