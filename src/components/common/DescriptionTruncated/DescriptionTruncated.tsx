import {useState} from 'react';
import {BsThreeDots} from 'react-icons/bs';

import config from '@/config';

import * as styled from './DescriptionTruncated.styled';

interface Props {
  text?: string;
}

function DescriptionTruncated({text}: Props) {
  if (!text) return null;

  const [displayTruncatedText, setDisplayTruncatedText] = useState<boolean>(true);

  const truncatedText = text.substring(0, config.descriptionMaxLength);

  const isTogglerVisible = text.length > truncatedText.length;

  function toggleTruncatedText() {
    setDisplayTruncatedText(val => !val);
  }

  return (
    <styled.text>
      {displayTruncatedText ? truncatedText : text}{' '}
      {isTogglerVisible && (
        <styled.toggler variant="outline-secondary" size="sm" onClick={toggleTruncatedText}>
          <BsThreeDots />
        </styled.toggler>
      )}
    </styled.text>
  );
}

export default DescriptionTruncated;
