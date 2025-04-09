export interface IUserProfile {
  avatar: string;
  gender: string;
  trainingExperience: number;
  userId: number;
  personalRecords: number;
  trainingCount: number;
  about: string;
  UserProfile: {
    avatar: string;
    gender: string;
    trainingExperience: number;
    personalRecords: number;
    trainingCount: number;
    userId: number;
    about: string;
  };
  name: string;
  email: string;
  id: number;
}

export interface IUser {
  surname: string;
  id: number;
  name: string;
  email: string;
  trener: boolean;
  UserProfile: IUserProfile | null;
}
