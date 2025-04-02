import { useContext } from "react";
import { BookHandlerType } from "../model"
import { BookContextHandler } from "../context/BookContext";

export const useBooks = (): BookHandlerType => {
    const handlers = useContext(BookContextHandler);
    if (!handlers) {
      throw new Error('no handlers context');
    }
    return handlers;
  };