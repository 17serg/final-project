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
  Divider,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { ExerciseApi, Exercise } from '@/entities/exercise/api/ExerciseApi';
import { debounce } from 'lodash';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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

  // Функция для сортировки категорий
  const sortCategories = (categories: string[]) => {
    const cardio = categories.filter((cat) => cat === 'Кардио');
    const functional = categories.filter((cat) => cat === 'Функциональные');
    const others = categories.filter((cat) => cat !== 'Кардио' && cat !== 'Функциональные');

    return { cardio, functional, others };
  };

  // Оптимизированное обновление длительности
  const debouncedSetDuration = useCallback(
    debounce((value: string) => {
      setDuration(value);
    }, 300),
    [],
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Добавить упражнение
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Категория</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange} label="Категория">
          {/* Кардио */}
          {sortCategories(categories).cardio.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}

          {/* Разделитель после Кардио */}
          {sortCategories(categories).cardio.length > 0 && <Divider />}

          {/* Функциональные */}
          {sortCategories(categories).functional.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}

          {/* Разделитель после Функциональных */}
          {sortCategories(categories).functional.length > 0 && <Divider />}

          {/* Остальные категории */}
          {sortCategories(categories).others.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
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
          label="Длительность (минуты)"
          type="number"
          defaultValue={duration}
          onChange={(e) => debouncedSetDuration(e.target.value)}
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
