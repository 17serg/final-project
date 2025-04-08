import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ExerciseCategory } from '@/entities/exercise/ui/ExerciseCategory/ExerciseCategory';
// import { exerciseApi } from '@/entities/exercise/api/ExerciseApi';
import { ExerciseApi } from '@/entities/exercise/api/ExerciseApi';

interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscle_groups: string[];
  equipment: string;
  image: string;
  exercise_type: 'compound' | 'isolation' | 'cardio' | 'bodyweight';
}

export default function CatalogExercisePage(): React.JSX.Element {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchExercises = async (): Promise<void> => {
      try {
        const response = await ExerciseApi.getAllExercises();
        const exercisesData = response.data as Exercise[];
        setExercises(exercisesData);
        
        // Получаем уникальные категории
        const uniqueCategories = Array.from(
          new Set(exercisesData.map((exercise: Exercise) => exercise.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Ошибка при загрузке упражнений:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent): void => {
    setSelectedCategory(event.target.value);
  };

  const sortedCategories = React.useMemo(() => {
    if (!selectedCategory) return categories;
    return [selectedCategory, ...categories.filter(cat => cat !== selectedCategory)];
  }, [categories, selectedCategory]);

  const styles = {
    container: {
      py: 4,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 4,
    },
    title: {
      color: 'white',
      textAlign: 'center',
    },
    filter: {
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
      borderRadius: '8px',
      minWidth: 200,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.7)',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(128, 128, 128, 0.9)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(128, 128, 128, 0.9)',
        borderWidth: '1px',
      },
      '& .MuiSelect-select': {
        color: 'rgba(128, 128, 128, 0.9)',
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(207, 207, 207, 0.9)',
      },
      '& .MuiSvgIcon-root': {
        color: 'rgba(207, 207, 207, 0.9)',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(128, 128, 128, 0.9)',
            borderWidth: '1px',
          },
        },
      },
      '& .MuiMenuItem-root': {
        color: 'rgba(128, 128, 128, 0.9)',
        '&.Mui-selected': {
          backgroundColor: 'rgba(128, 128, 128, 0.2)',
        },
        '&:hover': {
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
        },
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.header}>
        <FormControl sx={styles.filter}>
          <InputLabel id="category-filter-label">Категория</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            label="Категория"
            onChange={handleCategoryChange}
          >
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
        <Typography variant="h4" sx={styles.title}>
          Каталог упражнений
        </Typography>
        <Box sx={styles.filter} /> {/* Пустой Box для выравнивания */}
      </Box>
      
      {sortedCategories.map((category) => (
        <ExerciseCategory
          key={category}
          category={category}
          exercises={exercises.filter(exercise => exercise.category === category)}
        />
      ))}
    </Container>
  );
}
