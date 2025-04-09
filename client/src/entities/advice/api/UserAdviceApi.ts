import { axiosInstance } from '@/shared/lib/axiosInstance';
import { Advice } from './AdviceApi';
import { AxiosResponse } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UserAdvice {
  id: number;
  userId: number;
  adviceId: number;
  advice: Advice;
  createdAt: string;
  updatedAt: string;
}

export const UserAdviceApi = {
  // Получить все сохраненные советы пользователя
  getUserAdvices: (): Promise<AxiosResponse<ApiResponse<UserAdvice[]>>> =>
    axiosInstance.get<ApiResponse<UserAdvice[]>>('/user-advices'),

  // Сохранить совет в коллекцию пользователя
  saveAdvice: (adviceId: number): Promise<AxiosResponse<ApiResponse<UserAdvice>>> =>
    axiosInstance.post<ApiResponse<UserAdvice>>('/user-advices', { adviceId }),

  // Удалить совет из коллекции пользователя
  removeAdvice: (adviceId: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosInstance.delete<ApiResponse<void>>(`/user-advices/${adviceId}`),

  // Проверить, сохранен ли совет пользователем
  isAdviceSaved: (adviceId: number): Promise<AxiosResponse<ApiResponse<boolean>>> =>
    axiosInstance.get<ApiResponse<boolean>>(`/user-advices/${adviceId}/check`),
};
