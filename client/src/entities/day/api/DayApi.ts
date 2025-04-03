import { axiosInstance } from '@/shared/lib/axiosInstance';
import { Day } from '../model/types';

export const DayApi = {
  getDaysByMonth: async (date: Date, userId: number) => {
    const response = await axiosInstance.get<Day[]>('/days', {
      params: {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        userId,
      },
    });
    return response;
  },

  createDay: async (data: Omit<Day, 'id'>) => {
    const response = await axiosInstance.post<Day>('/days', data);
    return response;
  },

  updateDay: async (id: number, data: Partial<Day>) => {
    const response = await axiosInstance.patch<Day>(`/days/${id}`, data);
    return response;
  },

  deleteDay: async (id: number) => {
    const response = await axiosInstance.delete(`/days/${id}`);
    return response;
  },
};
