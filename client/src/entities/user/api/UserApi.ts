import { axiosInstance } from '@/shared/lib/axiosInstance';
import { IAuthResponseData, IUserLoginData, IUserSignUpData, IUserProfile } from '../model';
import { AxiosResponse } from 'axios';

enum USER_API_ENDPOINTS {
  SIGN_UP = '/auth/signup',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  REFRESH_TOKENS = '/tokens/refresh',
  PROFILE = '/user/profile',
}

export class UserApi {
  static async refreshTokens(): Promise<AxiosResponse<IAuthResponseData>> {
    const response = await axiosInstance.get(USER_API_ENDPOINTS.REFRESH_TOKENS);
    return response;
  }

  static async login(loginData: IUserLoginData): Promise<AxiosResponse<IAuthResponseData>> {
    const response = await axiosInstance.post(USER_API_ENDPOINTS.LOGIN, loginData);
    return response;
  }

  static async signup(signUpData: IUserSignUpData): Promise<AxiosResponse<IAuthResponseData>> {
    const response = await axiosInstance.post(USER_API_ENDPOINTS.SIGN_UP, signUpData);
    console.log(response);
    return response;
  }

  static async logout(): Promise<AxiosResponse> {
    const response = await axiosInstance.get(USER_API_ENDPOINTS.LOGOUT);
    return response;
  }

  static async updateProfile(profileData: IUserProfile): Promise<AxiosResponse> {
    return axiosInstance.post(USER_API_ENDPOINTS.PROFILE, profileData);
  }

  static async getProfile(): Promise<AxiosResponse<IUserProfile>> {
    return axiosInstance.get(USER_API_ENDPOINTS.PROFILE);
  }
}
