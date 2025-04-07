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

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Начальный' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
];

const AddExerciseForm = ({ onSubmit }: AddExerciseFormProps) => {
  const [exerciseId, setExerciseId] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<Exercise['exercise_type']>('compound');
  const [difficulty, setDifficulty] = useState<Exercise['difficulty']>('beginner');

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await ExerciseApi.getMuscleGroups();
        setMuscleGroups(response.data);
      } catch (error) {
        console.error('Ошибка при получении групп мышц:', error);
      }
    };

    fetchMuscleGroups();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      if (selectedMuscleGroups.length > 0) {
        try {
          const exercises = await Promise.all(
            selectedMuscleGroups.map((group) => ExerciseApi.getExercisesByMuscleGroup(group)),
          );
          const uniqueExercises = [
            ...new Set(exercises.flatMap((response: { data: Exercise[] }) => response.data)),
          ] as Exercise[];
          setExercises(uniqueExercises);
        } catch (error) {
          console.error('Ошибка при получении упражнений:', error);
        }
      } else {
        setExercises([]);
      }
    };

    fetchExercises();
  }, [selectedMuscleGroups]);

  const handleMuscleGroupsChange = (event: any) => {
    const value = event.target.value;
    setSelectedMuscleGroups(typeof value === 'string' ? value.split(',') : value);
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
        <InputLabel>Группы мышц</InputLabel>
        <Select
          multiple
          value={selectedMuscleGroups}
          onChange={handleMuscleGroupsChange}
          input={<OutlinedInput label="Группы мышц" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {muscleGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
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
        <InputLabel>Сложность</InputLabel>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Exercise['difficulty'])}
          label="Сложность"
        >
          {DIFFICULTY_LEVELS.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Упражнение</InputLabel>
        <Select value={exerciseId} onChange={handleExerciseChange} label="Упражнение" required>
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Длительность (сек)"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Вес (кг)"
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
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

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Добавить
      </Button>
    </Box>
  );
};

export default AddExerciseForm;
