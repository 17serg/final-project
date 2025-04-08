import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Exercise } from '@/entities/exercise/api/ExerciseApi';

interface ExerciseCardProps {
  exercise: Exercise;
}

const styles = {
  card: {
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: "all 0.3s ease",
    backdropFilter: "blur(9px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.4)",
    maxWidth: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  media: {
    height: 200,
    objectFit: 'cover',
  },
  content: {
    color: 'white',
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
  return (
    <Card sx={styles.card}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={styles.media}
          image={exercise.image}
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
        <Typography variant="body2" color="rgba(230, 230, 230, 0.62)">
          {exercise.description}
        </Typography>
      </CardContent>
    </Card>
  );
}; 