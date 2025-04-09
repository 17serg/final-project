import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ApiResponse } from '@/shared/types/api';

export interface Advice {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const AdviceApi = {
  getRandomAdvice: () => axiosInstance.get<ApiResponse<Advice>>('/advice/random'),
};
