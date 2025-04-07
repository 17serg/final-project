export interface Training {
  id: number;
  dayId: number;
  userId: number;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingDto {
  dayId: number;
  userId: number;
  complete: boolean;
}
