import React from 'react';
import { Box } from '@mui/material';

const styles = {
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 1s ease-in-out',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: -1,
  }
};

export const AnimatedBackground: React.FC = () => {
  const [currentImage, setCurrentImage] = React.useState(0);
  const images = [
    '/background/photo_2025-04-07_12-11-45.jpg',
    '/background/photo_2025-04-07_12-11-49.jpg'
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box
        sx={{
          ...styles.background,
          backgroundImage: `url(${images[currentImage]})`,
        }}
      />
      <Box sx={styles.overlay} />
    </>
  );
}; 