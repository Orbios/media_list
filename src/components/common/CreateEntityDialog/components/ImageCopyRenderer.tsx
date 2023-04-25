import {CopyToClipboard} from 'react-copy-to-clipboard';
import {CgCopy} from 'react-icons/cg';

import notificationHelper from '@/helpers/notificationHelper';

import ImageRender from '@/components/common/ImageRender';
import Tooltip from '@/components/common/Tooltip';

import * as styled from './ImageCopyRenderer.styled';

interface Props {
  title: string;
  url: string;
  itemId: string | number;
}

function ImageCopyRenderer({title, url, itemId}: Props) {
  const tooltipId = `tooltip-image-${itemId}`;

  return (
    <styled.wrapper>
      <ImageRender title={title} url={url} />

      <Tooltip id={tooltipId} title="Copy image URL" placement="right">
        <CopyToClipboard text={url} onCopy={() => notificationHelper.message('URL copied to clipboard')}>
          <styled.button variant="outline-secondary" size="sm">
            <CgCopy />
          </styled.button>
        </CopyToClipboard>
      </Tooltip>
    </styled.wrapper>
  );
}

export default ImageCopyRenderer;
