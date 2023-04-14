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
  movie: Movie;
  genres: string[];
  lists: List[];
  save: () => void;
  close: () => void;
  onChange: (field: string, value: any) => void;
}

function EditMovie({visible, movie, genres, lists, onChange, close, save}: Props) {
  const [options, setOptions] = useState<BasicOption[]>([]);
  const [listsOptions, setListsOptions] = useState<RadioOption[]>([]);
  const [errors, setErrors] = useState({title: '', year: '', runtime: '', director: '', actors: ''});

  useEffect(() => {
    const genresOptions = genres.map(genre => {
      return {value: genre, label: genre};
    });
    setOptions(genresOptions);

    const movieListsOptions = lists.map(list => {
      return {name: list.title, value: list.id};
    });
    setListsOptions(movieListsOptions);
  }, [genres]);

  function formIsValid() {
    const formErrors = {
      title: '',
      year: '',
      runtime: '',
      director: '',
      actors: ''
    };

    if (!movie.title) {
      formErrors.title = 'Title field is required.';
    }

    if (!movie.year) {
      formErrors.year = 'Year field is required.';
    } else if (movie.year < 1900 || movie.year > 2050) {
      formErrors.year = 'Invalid year value (should be between 1900 and 2050).';
    }

    if (!movie.runtime) {
      formErrors.runtime = 'Runtime field is required.';
    }

    if (!movie.director) {
      formErrors.director = 'Director field is required.';
    }

    if (!movie.actors) {
      formErrors.actors = 'Actors field is required.';
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
      return movie.genres.indexOf(option.value) !== -1;
    });

    return (
      <Modal show={visible} onHide={close}>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>Edit movie</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TextInput
            name="title"
            label="Title"
            value={movie.title}
            onChange={onChange}
            placeholder="Title"
            error={errors.title}
          />

          <NumberInput name="year" label="Year" value={movie.year} onChange={onChange} error={errors.year} />

          <NumberInput
            name="runtime"
            label="Runtime"
            value={movie.runtime}
            onChange={onChange}
            error={errors.runtime}
          />

          <SelectInput name="genres" label="Genres" options={options} value={selectedGenres} onChange={onChange} />

          <TextInput
            name="director"
            label="Director"
            value={movie.director}
            onChange={onChange}
            placeholder="Director"
            error={errors.director}
          />

          <TextAreaInput
            name="actors"
            rows={2}
            label="Actors (comma separated)"
            value={movie.actors}
            onChange={onChange}
            placeholder="Actors"
            error={errors.actors}
          />

          <TextAreaInput name="plot" rows={4} label="Plot" value={movie.plot} onChange={onChange} placeholder="Plot" />

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
                  checked={movie.lists[0] === listOption.value}
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

export default EditMovie;
