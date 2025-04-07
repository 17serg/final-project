export interface IAnthropometry {
  id?: number;
  date: string | number;
  weight: string | number;
  height: string | number;
  chest: string | number;
  breast?: string | number;
  waist: string | number;
  hips: string | number;
  userId: number;
} 