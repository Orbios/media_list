import {Button} from '@/components/bootstrap';
import {useState, useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '@/hooks';
import {setNewPreferenceDir} from '@/reducers/commonSlice';

import {saveDirPref} from '@/files/preferences';
import {getDbFilePath, moveFile} from '@/files/fileAccess';
import {showDialogForSelectingDirectory} from '@/electron/senders';

import config from '@/config';
import notificationHelper from '@/helpers/notificationHelper';

import PageWrapper from '@/components/common/PageWrapper';

function PreferencesPage() {
  const dispatch = useAppDispatch();

  const preferenceDir = useAppSelector(state => state.common.preferenceDir);
  const newPreferenceDir = useAppSelector(state => state.common.newPreferenceDir);

  const [fileDir, setFileDir] = useState(getDbFilePath(preferenceDir));

  useEffect(() => {
    if (!newPreferenceDir) return;

    moveDir(newPreferenceDir);

    return () => {
      dispatch(setNewPreferenceDir(''));
    };
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
    <PageWrapper title="Preferences">
      <fieldset>
        <legend>Db file:</legend>

        <div className="fieldset-content">
          <div className="form-group">
            <p className="file-dir">{fileDir}</p>
            <Button onClick={showDialogForSelectingDirectory}>Change directory</Button>
          </div>
        </div>
      </fieldset>
    </PageWrapper>
  );
}

export default PreferencesPage;
