import React from 'react';
import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseOfTraining } from '../api/TrainingApi';
import ExerciseSetList from './ExerciseSetList';

interface ExerciseListProps {
  exercises: ExerciseOfTraining[];
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onMoveExercise }) => {
  const [expandedExercise, setExpandedExercise] = React.useState<number | null>(null);

  const handleToggleExpand = (exerciseId: number): void => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
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
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {exercise.sets} подходов × {exercise.reps} повторений
                    {exercise.weight && ` × ${exercise.weight} кг`}
                  </Typography>
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
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ExerciseList;
