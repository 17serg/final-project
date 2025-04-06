export interface IUserProfile {
  avatar: string;
  gender: string;
  trainingExperience: number;
  userId: number;
  personalRecords: number;
  trainingCount: number;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  UserProfile: IUserProfile | null;
}
