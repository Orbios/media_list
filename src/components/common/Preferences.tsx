import {Modal, Button} from 'react-bootstrap';
import {useState, useEffect} from 'react';

import {useAppSelector} from '@/hooks';

import {saveDirPref} from '@/files/preferences';
import {getDbFilePath, moveFile} from '@/files/fileAccess';
import {showDialogForSelectingDirectory} from '@/electron/senders';

import config from '@/config';
import notificationHelper from '@/helpers/notificationHelper';

interface Props {
  visible?: boolean;
  close: () => void;
}

function Preferences({visible, close}: Props) {
  const preferenceDir = useAppSelector(state => state.common.preferenceDir);
  const newPreferenceDir = useAppSelector(state => state.common.newPreferenceDir);

  const [fileDir, setFileDir] = useState(getDbFilePath(preferenceDir));

  useEffect(() => {
    if (!newPreferenceDir) return;
    moveDir(newPreferenceDir);
  }, [newPreferenceDir]);

  async function moveDir(newDir) {
    try {
      await moveFile(fileDir, `${newDir}/${config.dbFileName}`);
      updateDir(newDir);
      notificationHelper.message('DB file was successfully moved.');
    } catch (err) {
      notificationHelper.error('An error occurred when moving the file.');
    }
  }

  function updateDir(dir: string) {
    saveDirPref(dir);
    setFileDir(getDbFilePath(fileDir));
  }

  return (
    <Modal show={visible} backdrop="static" onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Preferences</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <fieldset className="fieldset-file-dir">
          <legend>Db file:</legend>

          <div className="fieldset-content">
            <div className="form-group">
              <p className="file-dir">{fileDir}</p>
              <Button onClick={showDialogForSelectingDirectory}>Change directory</Button>
            </div>
          </div>
        </fieldset>
      </Modal.Body>
    </Modal>
  );
}

export default Preferences;
