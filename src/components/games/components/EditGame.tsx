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
  game: Game;
  genres: string[];
  lists: List[];
  save: () => void;
  close: () => void;
  onChange: (field: string, value: any) => void;
}

function EditGame({visible, game, genres, lists, onChange, close, save}: Props) {
  const [options, setOptions] = useState<BasicOption[]>([]);
  const [listsOptions, setListsOptions] = useState<RadioOption[]>([]);
  const [errors, setErrors] = useState({title: '', released: '', developers: ''});

  useEffect(() => {
    const genresOptions = genres.map(genre => {
      return {value: genre, label: genre};
    });
    setOptions(genresOptions);

    const gameListsOptions = lists.map(list => {
      return {name: list.title, value: list.id};
    });
    setListsOptions(gameListsOptions);
  }, [genres]);

  function formIsValid() {
    const formErrors = {
      title: '',
      released: '',
      developers: ''
    };

    if (!game.title) {
      formErrors.title = 'Title field is required.';
    }

    if (!game.released) {
      formErrors.released = 'Released date is required.';
    } else if (game.released < 1958 || game.released > 2050) {
      formErrors.released = 'Invalid released date value (should be between 1958 and 2050).';
    }

    if (!game.developers) {
      formErrors.developers = 'Developers field is required.';
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
      return game.genres.indexOf(option.value) !== -1;
    });

    return (
      <Modal show={visible} onHide={close}>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>Edit game</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TextInput
            name="title"
            label="Title"
            value={game.title}
            onChange={onChange}
            placeholder="Title"
            error={errors.title}
          />

          <TextInput
            name="alternativeTitle"
            label="Alternative title"
            value={game.alternativeTitle}
            onChange={onChange}
            placeholder="Alternative title"
          />

          <TextInput name="slug" label="Slug" value={game.slug} onChange={onChange} placeholder="Slug" />

          <NumberInput
            name="released"
            label="Released"
            value={game.released}
            onChange={onChange}
            error={errors.released}
          />

          <TextInput name="website" label="Website" value={game.website} onChange={onChange} placeholder="Website" />

          <SelectInput name="genres" label="Genres" options={options} value={selectedGenres} onChange={onChange} />

          <TextAreaInput
            name="developers"
            rows={2}
            label="Developers (comma separated)"
            value={game.developers}
            onChange={onChange}
            placeholder="Developers"
            error={errors.developers}
          />

          <TextAreaInput
            name="description"
            rows={4}
            label="Description"
            value={game.description}
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
                  checked={game.lists[0] === listOption.value}
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

export default EditGame;
