import { axiosInstance } from '@/shared/lib/axiosInstance';
import { Training, CreateTrainingDto } from '../model';
import { Training as TrainingType } from '../model/types';

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
    const response = await axiosInstance.delete(`/trainings/${id}`);
    return response;
  },

  getTrainingByDayId: async (dayId: number) => {
    const response = await axiosInstance.get(`/trainings/day/${dayId}`);
    return response;
  },
};
