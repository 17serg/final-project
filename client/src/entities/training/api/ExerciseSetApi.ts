import { axiosInstance } from '@/shared/lib/axiosInstance';

export interface ExerciseSet {
  id: number;
  exerciseOfTrainingId: number;
  setNumber: number;
  actualWeight: number | null;
  actualReps: number | null;
  isCompleted: boolean;
  notes: string | null;
  executionDate: string | null;
  executionTime: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateExerciseSetDto {
  setNumber: number;
  actualWeight?: number;
  actualReps?: number;
  isCompleted?: boolean;
  notes?: string;
}

export interface UpdateExerciseSetDto {
  actualWeight?: number;
  actualReps?: number;
  isCompleted?: boolean;
  notes?: string;
}

export interface CreateMultipleExerciseSetsDto {
  sets: CreateExerciseSetDto[];
}

export const ExerciseSetApi = {
  /**
   * Получение всех подходов для упражнения в тренировке
   * @param exerciseOfTrainingId ID упражнения в тренировке
   * @returns Массив подходов
   */
  getExerciseSets: (exerciseOfTrainingId: number) =>
    axiosInstance.get<ApiResponse<ExerciseSet[]>>(
      `/exercise-sets/exercise-of-training/${exerciseOfTrainingId}`,
    ),

  /**
   * Получение одного подхода по ID
   * @param id ID подхода
   * @returns Подход
   */
  getExerciseSetById: (id: number) =>
    axiosInstance.get<ApiResponse<ExerciseSet>>(`/exercise-sets/${id}`),

  /**
   * Создание нового подхода
   * @param exerciseOfTrainingId ID упражнения в тренировке
   * @param data Данные для создания подхода
   * @returns Созданный подход
   */
  createExerciseSet: (exerciseOfTrainingId: number, data: CreateExerciseSetDto) =>
    axiosInstance.post<ApiResponse<ExerciseSet>>(
      `/exercise-sets/exercise-of-training/${exerciseOfTrainingId}`,
      data,
    ),

  /**
   * Создание нескольких подходов для упражнения
   * @param exerciseOfTrainingId ID упражнения в тренировке
   * @param data Данные для создания подходов
   * @returns Массив созданных подходов
   */
  createMultipleExerciseSets: (exerciseOfTrainingId: number, data: CreateMultipleExerciseSetsDto) =>
    axiosInstance.post<ApiResponse<ExerciseSet[]>>(
      `/exercise-sets/exercise-of-training/${exerciseOfTrainingId}/multiple`,
      data,
    ),

  /**
   * Обновление подхода
   * @param id ID подхода
   * @param data Данные для обновления подхода
   * @returns Обновленный подход
   */
  updateExerciseSet: (id: number, data: UpdateExerciseSetDto) =>
    axiosInstance.patch<ApiResponse<ExerciseSet>>(`/exercise-sets/${id}`, data),

  /**
   * Удаление подхода
   * @param id ID подхода
   */
  deleteExerciseSet: (id: number) =>
    axiosInstance.delete<ApiResponse<void>>(`/exercise-sets/${id}`),
};
