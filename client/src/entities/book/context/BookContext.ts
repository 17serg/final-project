import { createContext } from "react";
import { BookHandlerType, IBook } from "../model";

export const BookContext = createContext<IBook[]>([]);
export const BookContextHandler = createContext<BookHandlerType | null>(
  null
);