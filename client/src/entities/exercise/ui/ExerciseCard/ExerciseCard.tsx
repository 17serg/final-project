import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Exercise } from '@/entities/exercise/api/ExerciseApi';

interface ExerciseCardProps {
  exercise: Exercise;
}

const styles = {
  card: {
    maxWidth: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  media: {
    height: 200,
    objectFit: 'cover',
  },
  content: {
    flexGrow: 1,
  },
  category: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const getImageUrl = (imagePath: string): string => {
    const baseUrl = import.meta.env.VITE_API.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };

  return (
    <Card sx={styles.card}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={styles.media}
          image={getImageUrl(exercise.image)}
          alt={exercise.name}
        />
        <Typography variant="body2" sx={styles.category}>
          {exercise.category}
        </Typography>
      </Box>
      <CardContent sx={styles.content}>
        <Typography gutterBottom variant="h6" component="div">
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exercise.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
