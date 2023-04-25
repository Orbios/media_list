import {useState} from 'react';
import {Modal, Button} from '@/components/bootstrap';

import validationHelper from '@/helpers/validationHelper';

import TextInput from '@/components/common/TextInput';

interface Props {
  visible: boolean;
  originalUrl: string;
  close: () => void;
  action: (url: string) => void;
}

function EditPosterDialog({visible, originalUrl, close, action}: Props) {
  const [posterUrl, setPosterUrl] = useState<string>(originalUrl);
  const [errors, setErrors] = useState({posterUrl: ''});

  function formIsValid() {
    const formErrors = {
      posterUrl: ''
    };

    if (!posterUrl) {
      formErrors.posterUrl = 'URL is required.';
    }

    setErrors(formErrors);

    return validationHelper.isEmptyErrorObject(formErrors);
  }

  async function updatePoster() {
    if (!formIsValid()) return;

    await action(posterUrl);
  }

  return (
    <Modal show={visible} size="lg" onHide={close}>
      <Modal.Header closeButton onClick={close}>
        <Modal.Title>Edit Poster</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <TextInput
          name="posterUrl"
          label="Poster url"
          value={posterUrl}
          onChange={(field, value) => setPosterUrl(value)}
          placeholder="Poster url"
          error={errors.posterUrl}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={updatePoster}>Update Poster</Button>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditPosterDialog;
