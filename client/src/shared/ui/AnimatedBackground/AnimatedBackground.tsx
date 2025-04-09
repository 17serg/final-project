import React from 'react';
import { Box } from '@mui/material';

const styles = {
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 1.5s ease-in-out',
    overflow: 'hidden',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: -1,
    overflow: 'hidden',
  }
};

export const AnimatedBackground: React.FC = () => {
  const [currentImage, setCurrentImage] = React.useState(0);
  const [nextImage, setNextImage] = React.useState(1);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const images = [
    '/background/IMG_5803.JPG',
    '/background/IMG_5728.JPG',
    '/background/IMG_5804.JPG',
    '/background/IMG_5808.JPG',
    '/background/IMG_5809.JPG',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImage + 1) % images.length;
      setNextImage(nextIndex);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage(nextIndex);
        setIsTransitioning(false);
      }, 1500);
    }, 5000);

    return (): void => clearInterval(interval);
  }, [currentImage, images.length]);

  return (
    <>
      <Box
        sx={{
          ...styles.background,
          backgroundImage: `url(${images[currentImage]})`,
          opacity: 1,
        }}
      />
      <Box
        sx={{
          ...styles.background,
          backgroundImage: `url(${images[nextImage]})`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
      <Box sx={styles.overlay} />
    </>
  );
}; 