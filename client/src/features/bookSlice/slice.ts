import { IBook } from '@/entities/book/model';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  addBookThunk,
  addFavouriteThunk,
  addReadedThunk,
  deleteBookThunk,
  loadAllBooksThunk,
  loadFavouriteBooksThunk,
  loadUserBooksThunk,
} from './thunk';

export type BookState = {
  books: IBook[];
  usersBooks: IBook[];
  likedUsersBooks: IBook[];
  //   readedUsersBooks: IBook[];
  sort: {
    key: 'order' | 'name';
    order: 'asc' | 'desc';
  };
  //   orderedPlaces: PlaceT[];
  isLoadingBooks: boolean;
};

const initialState: BookState = {
  books: [],
  usersBooks: [],
  likedUsersBooks: [],
  //   readedUsersBooks: [],
  sort: {
    key: 'order',
    order: 'asc',
  },
  //   orderedPlaces: [],
  isLoadingBooks: false,
};

function applySort(state: BookState): void {
  state.books = [...state.books].sort((a: IBook, b: IBook) => {
    if (state.sort.key === 'order') {
      return state.sort.order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return state.sort.order === 'asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });
}

export const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    changeSort: (state, action: PayloadAction<'order' | 'name'>) => {
      if (state.sort.key === action.payload) {
        state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.key = action.payload;
        state.sort.order = 'asc';
      }
      applySort(state);
      // state.books = state.books.toSorted((a, b) => {
      //   if (state.sort.key === 'order') {
      //     return state.sort.order === 'asc' ? a.order - b.order : b.order - a.order;
      //   }
      //   return state.sort.order === 'asc'
      //     ? a.title.localeCompare(b.title)
      //     : b.title.localeCompare(a.title);
      // });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllBooksThunk.fulfilled, (state, action) => {
        state.books = action.payload;
        state.isLoadingBooks = false;
      })
      .addCase(loadAllBooksThunk.pending, (state) => {
        state.isLoadingBooks = true;
      })
      .addCase(loadAllBooksThunk.rejected, (state) => {
        state.isLoadingBooks = false;
      })
      .addCase(loadUserBooksThunk.fulfilled, (state, action) => {
        state.usersBooks = action.payload;
        state.isLoadingBooks = false;
      })
      .addCase(loadUserBooksThunk.pending, (state) => {
        state.isLoadingBooks = true;
      })
      .addCase(loadUserBooksThunk.rejected, (state) => {
        state.isLoadingBooks = false;
      })
      .addCase(loadFavouriteBooksThunk.fulfilled, (state, action) => {
        state.likedUsersBooks = action.payload;
        state.isLoadingBooks = false;
      })
      .addCase(loadFavouriteBooksThunk.pending, (state) => {
        state.isLoadingBooks = true;
      })
      .addCase(loadFavouriteBooksThunk.rejected, (state) => {
        state.isLoadingBooks = false;
      })
      //   .addCase(loadReadedBooksThunk.fulfilled, (state, action) => {
      //     state.readedUsersBooks = action.payload;
      //     state.isLoadingBooks = false;
      //   })
      //   .addCase(loadReadedBooksThunk.pending, (state) => {
      //     state.isLoadingBooks = true;
      //   })
      //   .addCase(loadReadedBooksThunk.rejected, (state) => {
      //     state.isLoadingBooks = false;
      //   })
      .addCase(addBookThunk.fulfilled, (state, action) => {
        state.usersBooks = [...state.usersBooks, action.payload];
        state.books = [...state.books, action.payload];
        state.isLoadingBooks = false;
      })
      .addCase(addBookThunk.pending, (state) => {
        state.isLoadingBooks = true;
      })
      .addCase(addBookThunk.rejected, (state) => {
        state.isLoadingBooks = false;
      })
      .addCase(deleteBookThunk.fulfilled, (state, action) => {
        const targetBook = state.books.find((book) => book.id === action.payload);
        if (!targetBook) return;
        state.books = state.books.filter((book) => book.id !== action.payload);
        state.usersBooks = state.usersBooks.filter((book) => book.id !== action.payload);
        state.likedUsersBooks = state.likedUsersBooks.filter((book) => book.id !== action.payload);
      })
      .addCase(addFavouriteThunk.fulfilled, (state, action) => {
        const targetBook = state.likedUsersBooks.find((book) => book.id === action.payload.bookId);

        if (!targetBook) {
          const newBook = { ...action.payload.data };
          state.books = [
            ...state.books.map((book) => (book.id === action.payload.bookId ? newBook : book)),
          ];
          state.likedUsersBooks = [...state.likedUsersBooks, newBook];
          state.usersBooks = [
            ...state.usersBooks.map((book) => (book.id === action.payload.bookId ? newBook : book)),
          ];
        } else {
          state.likedUsersBooks = state.likedUsersBooks.filter(
            (book) => book.id !== action.payload.bookId,
          );
          state.books = [
            ...state.books.filter((book) => book.id !== action.payload.bookId),
            action.payload.data,
          ];
          state.usersBooks = [
            ...state.usersBooks.filter((book) => book.id !== action.payload.bookId),
            action.payload.data,
          ];
        }
      })
      .addCase(addReadedThunk.fulfilled, (state, action) => {
        const newBook = { ...action.payload.data };
        state.books = [
          ...state.books.map((book) => (book.id === action.payload.bookId ? newBook : book)),
        ];
        state.likedUsersBooks = [
          ...state.likedUsersBooks.map((book) =>
            book.id === action.payload.bookId ? newBook : book,
          ),
        ];
        state.usersBooks = [
          ...state.usersBooks.map((book) => (book.id === action.payload.bookId ? newBook : book)),
        ];
      });
  },
});

// Action creators are generated for each case reducer function
export const { changeSort } = bookSlice.actions;

export default bookSlice.reducer;
