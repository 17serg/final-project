export interface IUserLoginData {
    email: string;
    password: string;
  }
  
  export interface IUserSignUpData extends IUserLoginData {
    name: string;
    surname: string;
    birthDate: string;
    trener: boolean;
  }
  
  export interface IUser {
    id: number;
    email: string;
    name: string;
    surname: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IAuthResponseData {
    user: IUser;
    accessToken: string;
  }

