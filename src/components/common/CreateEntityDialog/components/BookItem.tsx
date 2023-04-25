import {Button} from '@/components/bootstrap';
import {RiEditLine} from 'react-icons/ri';
import {FaPlus} from 'react-icons/fa';

import formatHelper from '@/helpers/formatHelper';

import bookMapper from '@/services/mappers/bookMapper';

import ImageCopyRenderer from './ImageCopyRenderer';

import * as styled from '../CreateEntityDialog.styled';

interface Props {
  book: GoogleBook;
  allBooks: Book[];
  action: (book: Book) => void;
}

function BookItem({book, allBooks, action}: Props) {
  const volumeInfo = book.volumeInfo;
  const imageUrl = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '';

  async function createEntity(book: GoogleBook) {
    const bookToCreate = bookMapper.mapGoogleBookToBook(book);
    await action(bookToCreate);
  }

  async function editEntity(bookId?: number) {
    if (!bookId) return;

    const bookToEdit = allBooks.find(m => m.id === bookId);

    if (!bookToEdit) return;

    await action(bookToEdit);
  }

  return (
    <styled.entityItem key={book?.googleId}>
      <ImageCopyRenderer title={volumeInfo.title} url={imageUrl} itemId={book.googleId} />

      <styled.entityContent>
        <div>
          <h5>{volumeInfo.title}</h5>
          <p>{volumeInfo?.authors?.map(author => author).join(', ')}</p>
          <p>{formatHelper.truncateTextToLength(volumeInfo.description, 120)}</p>
        </div>

        <div>
          {book.id ? (
            <Button variant="outline-secondary" size="sm" onClick={() => editEntity(book?.id)}>
              <RiEditLine />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={() => createEntity(book)}>
              <FaPlus />
            </Button>
          )}
        </div>
      </styled.entityContent>
    </styled.entityItem>
  );
}

export default BookItem;
