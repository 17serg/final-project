import { Box, Typography, Paper, Grid, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ExerciseOfTraining } from '../api/TrainingApi';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseListProps {
  exercises: ExerciseOfTraining[];
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
}

const ExerciseList = ({ exercises, onMoveExercise }: ExerciseListProps) => {
  if (exercises.length === 0) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Нет добавленных упражнений
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Упражнения
      </Typography>
      <Grid container spacing={2}>
        <AnimatePresence>
          {exercises.map((exerciseOfTraining, index) => (
            <Grid item xs={12} key={exerciseOfTraining.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exerciseOfTraining.Exercise.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={exerciseOfTraining.Exercise.muscle_group}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Tooltip title="Переместить вверх">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onMoveExercise(index, index - 1)}
                              disabled={index === 0}
                              sx={{ p: 0.5 }}
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Переместить вниз">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => onMoveExercise(index, index + 1)}
                              disabled={index === exercises.length - 1}
                              sx={{ p: 0.5 }}
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {exerciseOfTraining.Exercise.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Подходы: {exerciseOfTraining.sets}</Typography>
                    <Typography variant="body2">Повторения: {exerciseOfTraining.reps}</Typography>
                    <Typography variant="body2">Вес: {exerciseOfTraining.weight} кг</Typography>
                    <Typography variant="body2">
                      Длительность: {exerciseOfTraining.duration} мин
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

export default ExerciseList;
