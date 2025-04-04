import { axiosInstance } from '@/shared/lib/axiosInstance';
import { IAnthropometry } from '../model';

export const AnthropometryApi = {
  getMeasurements: async (): Promise<IAnthropometry[]> => {
    return axiosInstance.get<IAnthropometry[]>('/anthropometry').then(res => res.data);
  },

  addMeasurement: (data: IAnthropometry): Promise<IAnthropometry> => {
    return axiosInstance.post<IAnthropometry>('/anthropometry', data).then(res => res.data);
  },

  updateMeasurement: (id: number, data: IAnthropometry): Promise<IAnthropometry> => {
    return axiosInstance.put<IAnthropometry>(`/anthropometry/${id}`, data).then(res => res.data);
  },

  deleteMeasurement: (id: number): Promise<void> => {
    return axiosInstance.delete(`/api/anthropometry/${id}`);
  }
}; 