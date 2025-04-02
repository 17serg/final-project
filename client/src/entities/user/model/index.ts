export interface IUserLoginData {
    email: string;
    password: string;
  }
  
  export interface IUserSignUpData extends IUserLoginData {
    name: string;
  }
  
  export interface IUser {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IAuthResponseData {
    user: IUser;
    accessToken: string;
  }