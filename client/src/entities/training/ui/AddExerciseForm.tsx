import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface AddExerciseFormProps {
  onSubmit: (data: {
    exerciseId: number;
    duration: number;
    weight: number;
    sets: number;
    reps: number;
  }) => void;
}

const AddExerciseForm = ({ onSubmit }: AddExerciseFormProps) => {
  const [exerciseId, setExerciseId] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      exerciseId: Number(exerciseId),
      duration: Number(duration),
      weight: Number(weight),
      sets: Number(sets),
      reps: Number(reps),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Добавить упражнение
      </Typography>
      <TextField
        label="ID упражнения"
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Продолжительность (мин)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Вес (кг)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Количество подходов"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Количество повторений"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Добавить
      </Button>
    </Box>
  );
};

export default AddExerciseForm;
