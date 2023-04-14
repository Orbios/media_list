import {useState, useEffect} from 'react';
import {Modal, Button, ButtonGroup, ToggleButton, Form} from '@/components/bootstrap';

import validationHelper from '@/helpers/validationHelper';

import TextInput from '@/components/common/TextInput';
import TextAreaInput from '@/components/common/TextAreaInput';
import NumberInput from '@/components/common/NumberInput';
import SelectInput from '@/components/common/SelectInput';

interface RadioOption {
  name: string;
  value: number;
}

interface Props {
  visible: boolean;
  book: Book;
  genres: string[];
  lists: List[];
  save: () => void;
  close: () => void;
  onChange: (field: string, value: any) => void;
}

function EditBook({visible, book, genres, lists, onChange, close, save}: Props) {
  const [options, setOptions] = useState<BasicOption[]>([]);
  const [listsOptions, setListsOptions] = useState<RadioOption[]>([]);
  const [errors, setErrors] = useState({title: '', authors: '', genres: ''});

  useEffect(() => {
    const genresOptions = genres.map(genre => {
      return {value: genre, label: genre};
    });
    setOptions(genresOptions);

    const bookListsOptions = lists.map(list => {
      return {name: list.title, value: list.id};
    });
    setListsOptions(bookListsOptions);
  }, [genres]);

  function formIsValid() {
    const formErrors = {
      title: '',
      authors: '',
      genres: ''
    };

    if (!book.title) {
      formErrors.title = 'Title field is required.';
    }

    if (!book.authors) {
      formErrors.authors = 'Authors field is required.';
    }

    if (!book.genres) {
      formErrors.genres = 'Genres field is required.';
    }

    setErrors(formErrors);

    return validationHelper.isEmptyErrorObject(formErrors);
  }

  function onSave() {
    if (!formIsValid()) return;

    save();
  }

  function render() {
    const selectedGenres = options.filter(option => {
      return book.genres?.indexOf(option.value) !== -1;
    });

    return (
      <Modal show={visible} onHide={close}>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>Edit book</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TextInput
            name="title"
            label="Title"
            value={book.title}
            onChange={onChange}
            placeholder="Title"
            error={errors.title}
          />

          <TextInput
            name="alternativeTitle"
            label="Alternative title"
            value={book.alternativeTitle}
            onChange={onChange}
            placeholder="Alternative title"
          />

          <TextInput
            name="subtitle"
            label="Subtitle"
            value={book.subtitle}
            onChange={onChange}
            placeholder="Subtitle"
          />

          <NumberInput name="publishedDate" label="Published date" value={book.publishedDate} onChange={onChange} />

          <NumberInput name="pageCount" label="Page count" value={book.pageCount} onChange={onChange} />

          <SelectInput name="genres" label="Genres" options={options} value={selectedGenres} onChange={onChange} />

          <TextAreaInput
            name="authors"
            rows={2}
            label="Authors (comma separated)"
            value={book.authors.join(', ')}
            onChange={onChange}
            placeholder="Authors"
            error={errors.authors}
          />

          <TextAreaInput
            name="description"
            rows={4}
            label="Description"
            value={book.description}
            onChange={onChange}
            placeholder="Description"
          />

          <Form.Group className="mb-4">
            <Form.Label htmlFor="lists">Lists</Form.Label>
            <br />
            <ButtonGroup>
              {listsOptions.map(listOption => (
                <ToggleButton
                  key={listOption.value}
                  id={`radio-${listOption.value}`}
                  type="radio"
                  variant={listOption.value % 2 ? 'outline-success' : 'outline-warning'}
                  name="lists"
                  value={listOption.value}
                  checked={book.lists[0] === listOption.value}
                  onChange={e => onChange('lists', [Number(e.currentTarget.value)])}>
                  {listOption.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onSave}>Save</Button>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return render();
}

export default EditBook;
