import {  useReducer } from "react";
import { IBook, IBookCreateData } from "../model";
import { BookContext, BookContextHandler } from "../context/BookContext";
import bookReducer from "../context/BookReducer";
import BookApi from "../api/BookApi";
// import { IUser } from "@/entities/user/model";

function BookProvider({
    children,
  }: {
    children: React.ReactElement;
  }): React.JSX.Element {
    const [initBooks, dispatch] = useReducer(bookReducer, []);

    const BooksHandler = async (): Promise<void> => {
      const books = await BookApi.getBooks();
      dispatch({ type: "SET_BOOKS", payload: books });
    };

    const favouriteBooksHandler = async (): Promise<void> => {
      const books = await BookApi.getFavouriteBooks();
      dispatch({ type: "SET_FAVOURITE_BOOKS", payload: books });
    };
    const MyBooksHandler = async (): Promise<void> => {
      const books = await BookApi.getMyBooks();
      dispatch({ type: "SET_MY_BOOKS", payload: books });
    };
    
    const addHandler = async (dataForm: IBookCreateData): Promise<void> => {
      const newBook = await BookApi.addBook(dataForm);
      dispatch({ type: "ADD_BOOK", payload: newBook });
    };

    const favouriteHandler = async (id: IBook["id"]): Promise<void> => {
      await BookApi.likeBook(id);
      dispatch({ type: "LIKE_BOOK", payload: id });
    };

  
    const deleteHandler = async (id: IBook["id"]): Promise<void> => {
      try {
        await BookApi.deleteBook(id);
        dispatch({ type: "DELETE_BOOK", payload: id });
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <BookContext.Provider value={initBooks}>
        <BookContextHandler.Provider value={{ BooksHandler,addHandler, deleteHandler, MyBooksHandler , favouriteHandler, favouriteBooksHandler}}>
          {children}
        </BookContextHandler.Provider>
      </BookContext.Provider>
    );
  }
  export default BookProvider;