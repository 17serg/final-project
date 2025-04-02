import { IUser } from "@/entities/user/model";

export interface IBook {
  id: number;
  title: string;
  description: string;
  link: string;
  userId: number;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
  Likes:{ userId:number,
    bookId:number,
  }[];
  Reads:{ userId:number,
    bookId:number,
  }[];
}

export interface IBookCreateData {
  title: string;
  description: string;
  link: string;
  // userId: number;
  fileName?: string;
}

export type BookActionType =
  | { type: 'SET_BOOKS'; payload: IBook[] }
  | { type: 'SET_MY_BOOKS'; payload: IBook[] }
  | { type: 'ADD_BOOK'; payload: IBook }
  | { type: 'DELETE_BOOK'; payload: IBook['id'] }
  | { type: 'LIKE_BOOK'; payload: IBook['id'] }
  | { type: 'SET_FAVOURITE_BOOKS'; payload: IBook[] }

export type BookHandlerType = {
  addHandler: (dataForm: IBookCreateData) => Promise<void>;
  deleteHandler: (id: IBook['id']) => Promise<void>;
  MyBooksHandler: (id: IUser['id']) => Promise<void>;
  BooksHandler: () => Promise<void>;
  favouriteHandler: (id: IBook['id']) => Promise<void>;
  favouriteBooksHandler: (id: IUser['id']) => void;
};
