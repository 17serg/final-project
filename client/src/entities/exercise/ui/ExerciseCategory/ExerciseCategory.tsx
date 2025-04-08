import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ExerciseCard } from '../ExerciseCard/ExerciseCard';
import { Exercise } from '@/entities/exercise/api/ExerciseApi';

interface ExerciseCategoryProps {
  category: string;
  exercises: Exercise[];
}

const styles = {
  categoryContainer: {
    marginBottom: 4,
  },
  categoryTitle: {
    marginBottom: 2,
    paddingBottom: 1,
    borderBottom: '2px solid #1976d2',
  },
};

export const ExerciseCategory: React.FC<ExerciseCategoryProps> = ({ 
  category, 
  exercises 
}) => {
  return (
    <Box sx={styles.categoryContainer}>
      <Typography variant="h5" sx={styles.categoryTitle}>
        {category}
      </Typography>
      <Grid container spacing={3}>
        {exercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={exercise.id}>
            <ExerciseCard exercise={exercise} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 