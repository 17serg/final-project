import React from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseOfTraining } from '../api/TrainingApi';
import ExerciseSetList from './ExerciseSetList';

interface ExerciseListProps {
  exercises: ExerciseOfTraining[];
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
  onDeleteExercise: (exerciseId: number) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onMoveExercise,
  onDeleteExercise,
}) => {
  const [expandedExercise, setExpandedExercise] = React.useState<number | null>(null);

  const handleToggleExpand = (exerciseId: number): void => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds} сек`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes} мин ${remainingSeconds} сек` : `${minutes} мин`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <AnimatePresence>
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Paper
              sx={{
                p: 2,
                mb: 2,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        minWidth: '30px',
                      }}
                    >
                      {index + 1}.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: -1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onMoveExercise(index, index - 1)}
                        disabled={index === 0}
                        sx={{ p: 0.5 }}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onMoveExercise(index, index + 1)}
                        disabled={index === exercises.length - 1}
                        sx={{ p: 0.5 }}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    {exercise.Exercise.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemText
                    primary={
                      <Box>
                        {exercise.Exercise.category === 'Кардио' ? (
                          <Typography variant="body2">
                            Длительность: {exercise.duration} мин
                          </Typography>
                        ) : (
                          <>
                            <Typography variant="body2">
                              Подходы: {exercise.sets} | Повторения: {exercise.reps} | Вес:{' '}
                              {exercise.weight} кг
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                  {exercise.Exercise.category !== 'Кардио' && (
                    <IconButton
                      size="small"
                      onClick={() => handleToggleExpand(exercise.id)}
                      sx={{
                        transform: expandedExercise === exercise.id ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        color: 'primary.main',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                        },
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  )}
                </Box>
                <IconButton onClick={() => onDeleteExercise(exercise.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              {exercise.Exercise.category !== 'Кардио' && (
                <Collapse in={expandedExercise === exercise.id}>
                  <ExerciseSetList
                    exerciseOfTrainingId={exercise.id}
                    plannedSets={exercise.sets}
                    plannedReps={exercise.reps}
                    plannedWeight={exercise.weight || 0}
                  />
                </Collapse>
              )}
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ExerciseList;
