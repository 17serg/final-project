import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, Collapse } from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { ExerciseOfTraining } from '../api/TrainingApi';
import ExerciseSetList from './ExerciseSetList';

interface ExerciseListProps {
  exercises: ExerciseOfTraining[];
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onMoveExercise }) => {
  const [expandedExercise, setExpandedExercise] = React.useState<number | null>(null);

  const handleToggleExpand = (exerciseId: number) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {exercises.map((exercise, index) => (
        <Paper
          key={exercise.id}
          sx={{
            p: 2,
            mb: 2,
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mr: 1,
                  color: 'primary.main',
                  fontWeight: 'bold',
                  minWidth: '30px',
                }}
              >
                {index + 1}.
              </Typography>
              <Typography variant="h6" sx={{ mr: 2 }}>
                {exercise.Exercise.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  onClick={() => onMoveExercise(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onMoveExercise(index, index + 1)}
                  disabled={index === exercises.length - 1}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {exercise.sets} подходов × {exercise.reps} повторений
                {exercise.weight && ` × ${exercise.weight} кг`}
              </Typography>
              <IconButton size="small" onClick={() => handleToggleExpand(exercise.id)}>
                {expandedExercise === exercise.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expandedExercise === exercise.id}>
            <ExerciseSetList
              exerciseOfTrainingId={exercise.id}
              plannedSets={exercise.sets}
              plannedReps={exercise.reps}
              plannedWeight={exercise.weight || 0}
            />
          </Collapse>
        </Paper>
      ))}
    </Box>
  );
};

export default ExerciseList;
