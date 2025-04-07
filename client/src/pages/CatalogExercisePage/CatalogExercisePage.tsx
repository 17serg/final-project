import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ExerciseCategory } from '@/entities/exercise/ui/ExerciseCategory/ExerciseCategory';
import { exerciseApi } from '@/entities/exercise/api/ExerciseApi';

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
        const response = await exerciseApi.getAllExercises();
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
      textAlign: 'center',
    },
    filter: {
      minWidth: 200,
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
