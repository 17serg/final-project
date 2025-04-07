import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { ExerciseApi, Exercise } from '@/entities/exercise/api/ExerciseApi';

interface AddExerciseFormProps {
  onSubmit: (data: {
    exerciseId: number;
    duration: number;
    weight: number;
    sets: number;
    reps: number;
  }) => void;
}

const EXERCISE_TYPES = [
  { value: 'compound', label: 'Базовое (многосуставное)' },
  { value: 'isolation', label: 'Изолированное' },
  { value: 'cardio', label: 'Кардио' },
  { value: 'bodyweight', label: 'С весом тела' },
];

const AddExerciseForm = ({ onSubmit }: AddExerciseFormProps) => {
  const [exerciseId, setExerciseId] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<Exercise['exercise_type']>('compound');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ExerciseApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      if (selectedCategory) {
        try {
          const response = await ExerciseApi.getExercisesByCategory(selectedCategory);
          setExercises(response.data);
        } catch (error) {
          console.error('Ошибка при получении упражнений:', error);
        }
      } else {
        setExercises([]);
      }
    };

    fetchExercises();
  }, [selectedCategory]);

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleExerciseChange = (event: any) => {
    const exercise = exercises.find((ex) => ex.id === event.target.value);
    setSelectedExercise(exercise || null);
    setExerciseId(event.target.value.toString());
  };

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

      <FormControl fullWidth margin="normal">
        <InputLabel>Категория</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Категория"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Тип упражнения</InputLabel>
        <Select
          value={exerciseType}
          onChange={(e) => setExerciseType(e.target.value as Exercise['exercise_type'])}
          label="Тип упражнения"
        >
          {EXERCISE_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Упражнение</InputLabel>
        <Select value={exerciseId} onChange={handleExerciseChange} label="Упражнение" required>
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {exercise.image && (
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    style={{ width: 30, height: 30, objectFit: 'cover' }}
                  />
                )}
                {exercise.name}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCategory === 'Кардио' ? (
        <TextField
          fullWidth
          margin="normal"
          label="Длительность (сек)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      ) : (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Вес (кг)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Количество подходов"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Количество повторений"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Добавить
      </Button>
    </Box>
  );
};

export default AddExerciseForm;
