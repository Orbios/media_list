import {isEmpty} from 'lodash';
import {RiDeleteBinLine, RiEditLine} from 'react-icons/ri';

import notificationHelper from '@/helpers/notificationHelper';

import DescriptionTruncated from '@/components/common/DescriptionTruncated';
import EditPoster from '@/components/common/EditPoster';

import * as styled from '@/styles/list.styled';

interface Props {
  books: Book[];
  onEditBook: (book: Book) => void;
  confirmDeleteBook: (id: number) => void;
  onUpdatePoster: (bookId: number, posterUrl: string) => void;
}

function BookList({books, onEditBook, confirmDeleteBook, onUpdatePoster}: Props) {
  const anyBooks = !isEmpty(books);

  if (!anyBooks) return <styled.noItems>No books.</styled.noItems>;

  function updateBook(book: Book) {
    onEditBook(book);
  }

  async function openLink(googleId: string) {
    if (!googleId) {
      notificationHelper.error('Google ID is not defined');
      return;
    }

    const url = `https://play.google.com/store/books/details?id=${googleId}`;

    await window.open(url, '_blank');
  }

  function renderBook(book: Book) {
    return (
      <styled.itemRow key={book.id}>
        <EditPoster url={book.posterUrl} title={book.title} itemId={book.id} onUpdatePoster={onUpdatePoster} />

        <styled.itemContent>
          <styled.itemHeader>
            <styled.actionLink variant="link" onClick={() => openLink(book.googleId)}>
              {book.title} {book.alternativeTitle && <span> ({book.alternativeTitle})</span>}
            </styled.actionLink>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => confirmDeleteBook(book.id)}>
              <RiDeleteBinLine />
            </styled.actionButton>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => updateBook(book)}>
              <RiEditLine />
            </styled.actionButton>
          </styled.itemHeader>

          <styled.itemInfo>{book.genres?.join(', ')}</styled.itemInfo>

          <styled.contributors>
            {book.authors?.join(', ')}
            {book.subtitle && <span>{book.subtitle}</span>}
          </styled.contributors>

          <DescriptionTruncated text={book.description} />
        </styled.itemContent>
      </styled.itemRow>
    );
  }

  function render() {
    return <styled.listContainer>{books.map(movie => renderBook(movie))}</styled.listContainer>;
  }

  return render();
}

export default BookList;
