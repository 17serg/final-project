import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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

const AddExerciseForm = ({ onSubmit }: AddExerciseFormProps) => {
  const [exerciseId, setExerciseId] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
      if (selectedMuscleGroup) {
        try {
          const response = await ExerciseApi.getExercisesByMuscleGroup(selectedMuscleGroup);
          setExercises(response.data);
        } catch (error) {
          console.error('Ошибка при получении упражнений:', error);
        }
      } else {
        setExercises([]);
      }
    };

    fetchExercises();
  }, [selectedMuscleGroup]);

  const handleMuscleGroupChange = (event: any) => {
    setSelectedMuscleGroup(event.target.value);
    setSelectedExercise(null);
    setExerciseId('');
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
        <InputLabel>Группа мышц</InputLabel>
        <Select
          value={selectedMuscleGroup}
          onChange={handleMuscleGroupChange}
          label="Группа мышц"
          required
        >
          {muscleGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Упражнение</InputLabel>
        <Select
          value={exerciseId}
          onChange={handleExerciseChange}
          label="Упражнение"
          required
          disabled={!selectedMuscleGroup}
        >
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
