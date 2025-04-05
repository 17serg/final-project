import { axiosInstance } from '@/shared/lib/axiosInstance';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  muscle_group: string;
  equipment: boolean;
  image_url: string | null;
}

export const ExerciseApi = {
  async getAllExercises() {
    const response = await axiosInstance.get<Exercise[]>('/exercises');
    return response;
  },

  async getMuscleGroups() {
    const response = await axiosInstance.get<string[]>('/exercises/muscle-groups');
    return response;
  },

  async getExercisesByMuscleGroup(muscleGroup: string) {
    const response = await axiosInstance.get<Exercise[]>(`/exercises/muscle-group/${muscleGroup}`);
    return response;
  },
};
