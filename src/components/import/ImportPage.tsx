import {useState, useRef} from 'react';
import {Button} from '@/components/bootstrap';

import notificationHelper from '@/helpers/notificationHelper';

import movieService from '@/services/movieService';

import PageWrapper from '@/components/common/PageWrapper';

import * as styled from './ImportPage.styled';

function ImportPage() {
  const inputRef = useRef<any>(null);

  const [added, setAdded] = useState<number>(0);
  const [skipped, setSkipped] = useState<number>(0);

  function openFileHandler() {
    if (!inputRef?.current) return;
    inputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    await importBookmarks(file.path);
  }

  async function importBookmarks(filePath) {
    if (!filePath) return;

    const importResults = await movieService.importMoviesFromFile(filePath);

    notificationHelper.message('Movies were successfully imported!');

    if (importResults?.added) setAdded(importResults.added);
    if (importResults?.skipped) setSkipped(importResults.skipped);
  }

  function render() {
    const resultsHidden = added === 0 && skipped === 0;

    return (
      <PageWrapper title="Import Movies">
        <fieldset>
          <p>
            Import movies from <b>csv</b> file - movies will be merged.
          </p>

          <Button onClick={openFileHandler}>Open file</Button>

          <styled.uploadInput type="file" ref={inputRef} accept=".csv" onChange={handleFileChange} />
        </fieldset>

        {!resultsHidden && (
          <styled.results>
            <h4>Import results</h4>
            <br />

            <p>Added: {added}</p>
            <p>Skipped: {skipped}</p>
          </styled.results>
        )}
      </PageWrapper>
    );
  }

  return render();
}

export default ImportPage;
