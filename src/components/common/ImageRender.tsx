import {useImageLoader} from '@/hooks/useImageLoader';

import {posterWidth, posterHeight} from '@/styles/shared';

interface Props {
  url: string;
  title: string;
}

function ImageRender({url, title}: Props) {
  const [imageSrc] = useImageLoader(url);

  return (
    <img
      width={posterWidth}
      height={posterHeight}
      src={imageSrc}
      title={title}
      alt={title}
      style={{objectFit: 'cover'}}
    />
  );
}

export default ImageRender;
