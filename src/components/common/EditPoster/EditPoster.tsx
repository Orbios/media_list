import {useState, Fragment} from 'react';
import {GrEdit} from 'react-icons/gr';

import ImageRender from '@/components/common/ImageRender';

import EditPosterDialog from './components/EditPosterDialog';

import * as styled from './EditPoster.styled';

interface Props {
  url: string;
  itemId: number;
  title: string;
  onUpdatePoster: (itemId: number, posterUrl: string) => void;
}

function EditPoster({url, itemId, title, onUpdatePoster}: Props) {
  const [isShown, setIsShown] = useState(false);
  const [editPosterDialogVisible, setEditPosterDialogVisible] = useState<boolean>(false);

  function onMouseEnter() {
    setIsShown(true);
  }

  function onMouseLeave() {
    setIsShown(false);
  }

  function toggleEditPosterDialog() {
    setEditPosterDialogVisible(vis => !vis);
  }

  async function onUpdateUrl(newUrl: string) {
    await onUpdatePoster(itemId, newUrl);
    toggleEditPosterDialog();
  }

  return (
    <Fragment key={itemId}>
      <styled.container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={toggleEditPosterDialog}>
        {!isShown && <ImageRender url={url} title={title} />}

        {isShown && (
          <styled.hoverContainer>
            <GrEdit />
          </styled.hoverContainer>
        )}
      </styled.container>

      {editPosterDialogVisible && (
        <EditPosterDialog
          visible={editPosterDialogVisible}
          originalUrl={url}
          close={toggleEditPosterDialog}
          action={onUpdateUrl}
        />
      )}
    </Fragment>
  );
}

export default EditPoster;
