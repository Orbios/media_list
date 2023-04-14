import {isEmpty} from 'lodash';
import {RiDeleteBinLine, RiEditLine} from 'react-icons/ri';

import notificationHelper from '@/helpers/notificationHelper';

import ImageRender from '@/components/common/ImageRender';

import * as styled from './BookList.styled';

interface Props {
  books: Book[];
  onEditBook: (book: Book) => void;
  confirmDeleteBook: (id: number) => void;
}

function BookList({books, onEditBook, confirmDeleteBook}: Props) {
  const anyBooks = !isEmpty(books);

  if (!anyBooks) return <styled.noBooks>No books.</styled.noBooks>;

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
    const displayPageCount = book?.pageCount === 0 ? 'N/A' : `${book.pageCount} pages.`;

    return (
      <styled.bookRow key={book.id}>
        <styled.imageContainer>
          <ImageRender url={book.posterUrl} title={book.title} />
        </styled.imageContainer>

        <styled.content>
          <styled.header>
            <styled.actionLink variant="link" onClick={() => openLink(book.googleId)}>
              {book.title} {book.alternativeTitle && <span> ({book.alternativeTitle})</span>}
            </styled.actionLink>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => confirmDeleteBook(book.id)}>
              <RiDeleteBinLine />
            </styled.actionButton>
            <styled.actionButton variant="outline-secondary" size="sm" onClick={() => updateBook(book)}>
              <RiEditLine />
            </styled.actionButton>
          </styled.header>

          <styled.info>
            {book.publishedDate}
            <span>{displayPageCount}</span>
            <span>{book.genres?.join(', ')}</span>
          </styled.info>

          <styled.actors>
            {book.authors?.join(', ')}
            {book.subtitle && <span>{book.subtitle}</span>}
          </styled.actors>

          <styled.description>{book.description}</styled.description>
        </styled.content>
      </styled.bookRow>
    );
  }

  function render() {
    return <styled.container>{books.map(movie => renderBook(movie))}</styled.container>;
  }

  return render();
}

export default BookList;
