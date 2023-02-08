import {useEffect, useState} from 'react';

import noMovieImage from '../assets/no-movie.png';

export const useImageLoader = (currentSrc: string) => {
  const [imageSrc, setImageSrc] = useState(noMovieImage);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(currentSrc);
    };

    img.src = currentSrc;
  }, [currentSrc]);

  return [imageSrc];
};
