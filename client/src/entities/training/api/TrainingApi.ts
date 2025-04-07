import { axiosInstance } from '@/shared/lib/axiosInstance';
import { Training, CreateTrainingDto } from '../model';
import { Exercise } from '@/entities/exercise/api/ExerciseApi';

export interface CreateExerciseOfTrainingDto {
  trainingId: number;
  exerciseId: number;
  duration: number;
  weight: number;
  sets: number;
  reps: number;
}

export interface ExerciseOfTraining {
  id: number;
  trainingId: number;
  exerciseId: number;
  duration: number;
  weight: number;
  sets: number;
  reps: number;
  muscle_groups: string[];
  exercise: Exercise;
}

export const TrainingApi = {
  async createTraining(data: CreateTrainingDto) {
    const response = await axiosInstance.post('/trainings', data);
    return response;
  },

  async getTrainingById(id: number) {
    const response = await axiosInstance.get(`/trainings/${id}`);
    return response;
  },

  async getUserTrainings(userId: number) {
    const response = await axiosInstance.get('/trainings', {
      params: { userId },
    });
    return response;
  },

  async updateTrainingStatus(id: number, complete: boolean) {
    const response = await axiosInstance.patch(`/trainings/${id}/status`, { complete });
    return response;
  },

  async deleteTraining(id: number) {
    try {
      const response = await axiosInstance.delete(`/trainings/${id}`);
      return response;
    } catch (error) {
      console.error('Ошибка при удалении тренировки:', error);
      throw error;
    }
  },

  getTrainingsByDayId: async (dayId: number) => {
    const response = await axiosInstance.get(`/trainings/day/${dayId}`);
    return response;
  },

  async createExerciseOfTraining(data: CreateExerciseOfTrainingDto) {
    const response = await axiosInstance.post('/exercise-of-trainings', data);
    return response;
  },

  async getExercisesOfTraining(trainingId: number) {
    const response = await axiosInstance.get<ExerciseOfTraining[]>(
      `/exercise-of-trainings/training/${trainingId}`,
    );
    return response;
  },

  async updateExercisesOrder(trainingId: number, exerciseIds: number[]) {
    const response = await axiosInstance.patch(
      `/exercise-of-trainings/training/${trainingId}/order`,
      { exerciseIds },
    );
    return response;
  },

  deleteExerciseOfTraining: async (exerciseId: number): Promise<void> => {
    return axiosInstance.delete(`/exercise-of-trainings/${exerciseId}`);
  },
};
