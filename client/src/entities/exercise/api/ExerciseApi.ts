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

export class ExerciseApi {
  private static instance: ExerciseApi;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = '/exercises';
  }

  public static getInstance(): ExerciseApi {
    if (!ExerciseApi.instance) {
      ExerciseApi.instance = new ExerciseApi();
    }
    return ExerciseApi.instance;
  }

  async getAllExercises(): Promise<{ data: Exercise[] }> {
    const response = await axiosInstance.get(this.baseUrl);
    return response;
  }

  async getExerciseById(id: number): Promise<{ data: Exercise }> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response;
  }

  async getExercisesByCategory(category: string): Promise<{ data: Exercise[] }> {
    const response = await axiosInstance.get(`${this.baseUrl}/category/${category}`);
    return response;
  }

  async getMuscleGroups(): Promise<{ data: string[] }> {
    const response = await axiosInstance.get(`${this.baseUrl}/muscle-groups`);
    return response;
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<{ data: Exercise[] }> {
    const response = await axiosInstance.get(`${this.baseUrl}/muscle-group/${muscleGroup}`);
    return response;
  }

  async getExercisesByType(type: Exercise['exercise_type']): Promise<{ data: Exercise[] }> {
    const response = await axiosInstance.get(`${this.baseUrl}/type/${type}`);
    return response;
  }

  async createExercise(exercise: Omit<Exercise, 'id'>): Promise<{ data: Exercise }> {
    const response = await axiosInstance.post(this.baseUrl, exercise);
    return response;
  }

  updateExercise: async (id: number, exercise: Partial<Exercise>) => {
    return await axiosInstance.put<Exercise>(`/exercises/${id}`, exercise);
  },

  getCategories: async () => {
    return await axiosInstance.get<string[]>('/exercises/categories');
  },

  async deleteExercise(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  

  getExercisesByCategory: async (category: string) => {
    return await axiosInstance.get<Exercise[]>(`/exercises/by-category/${category}`);
  },
};

export const exerciseApi = ExerciseApi.getInstance();
