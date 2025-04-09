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
  Avatar,
  Modal,
  IconButton,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { ExerciseApi, Exercise } from '@/entities/exercise/api/ExerciseApi';
import { debounce } from 'lodash';
import { Search as SearchIcon } from '@mui/icons-material';

interface AddExerciseFormProps {
  onSubmit: (data: {
    exerciseId: number;
    duration: number;
    weight: number;
    sets: number;
    reps: number;
  }) => void;
}

const styles = {
  exerciseOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  zoomIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.2s',
    width: 32,
    height: 32,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
  imageContainerHover: {
    '&:hover $zoomIcon': {
      opacity: 1,
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    outline: 'none',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '90vh',
    objectFit: 'contain' as const,
  },
};

const AddExerciseForm = ({ onSubmit }: AddExerciseFormProps) => {
  const [exerciseId, setExerciseId] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('50');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);

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

  // Обработчики для числовых полей с проверкой на отрицательные значения
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) >= 0) {
      setWeight(value);
    }
  };

  const handleSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) >= 0) {
      setSets(value);
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) >= 0) {
      setReps(value);
    }
  };

  const getImageUrl = (imagePath: string): string => {
    const baseUrl = import.meta.env.VITE_API.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };

  const handleImageClick = (e: React.MouseEvent, imagePath: string): void => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setSelectedImage(getImageUrl(imagePath));
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        background:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(9px)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        color: 'white',
        padding: '20px',
        alignItems: 'flex-start',
      }}
    >
      <Typography variant="h6" sx={{ paddingLeft: '16px' }} gutterBottom>
        Добавить упражнение
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Категория</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange} label="Категория">
          <MenuItem value="">
            <em>Все категории</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Упражнение</InputLabel>
        <Select value={exerciseId} onChange={handleExerciseChange} label="Упражнение">
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              <Box sx={styles.exerciseOption}>
                <Box sx={{ ...styles.imageContainer, ...styles.imageContainerHover }}>
                  <Avatar
                    src={getImageUrl(exercise.image)}
                    variant="rounded"
                    sx={styles.exerciseImage}
                    onClick={(e) => handleImageClick(e, exercise.image)}
                  />
                  <IconButton
                    size="small"
                    sx={styles.zoomIcon}
                    onClick={(e) => handleImageClick(e, exercise.image)}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography>{exercise.name}</Typography>
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
          inputProps={{ min: 0 }}
        />
      ) : (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Вес (кг)"
            type="number"
            value={weight}
            onChange={handleWeightChange}
            required
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Количество подходов"
            type="number"
            value={sets}
            onChange={handleSetsChange}
            required
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Количество повторений"
            type="number"
            value={reps}
            onChange={handleRepsChange}
            required
            inputProps={{ min: 0 }}
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Добавить
      </Button>

      <Modal open={modalOpen} onClose={handleCloseModal} sx={styles.modal}>
        <Box sx={styles.modalContent} onClick={handleCloseModal}>
          <img src={selectedImage} alt="Увеличенное изображение" style={styles.modalImage} />
        </Box>
      </Modal>
    </Box>
  );
};

export default AddExerciseForm;
