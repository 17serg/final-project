import { axiosInstance } from '@/shared/lib/axiosInstance';

export interface Exercise {
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

export const ExerciseApi = {
  getAllExercises: async () => {
    return await axiosInstance.get<Exercise[]>('/exercises');
  },

  getMuscleGroups: async () => {
    return await axiosInstance.get<string[]>('/exercises/muscle-groups');
  },

  getExercisesByMuscleGroup: async (muscleGroup: string) => {
    return await axiosInstance.get<Exercise[]>(`/exercises/muscle-group/${muscleGroup}`);
  },

  getExercisesByType: async (type: Exercise['exercise_type']) => {
    return await axiosInstance.get<Exercise[]>(`/exercises/type/${type}`);
  },

  createExercise: async (exercise: Omit<Exercise, 'id'>) => {
    return await axiosInstance.post<Exercise>('/exercises', exercise);
  },

  updateExercise: async (id: number, exercise: Partial<Exercise>) => {
    return await axiosInstance.put<Exercise>(`/exercises/${id}`, exercise);
  },

  getCategories: async () => {
    return await axiosInstance.get<string[]>('/exercises/categories');
  },

  deleteExercise: async (id: number) => {
    return await axiosInstance.delete(`/exercises/${id}`);
  },

  

  getExercisesByCategory: async (category: string) => {
    return await axiosInstance.get<Exercise[]>(`/exercises/by-category/${category}`);
  },
};