import { BookActionType, IBook } from '../model';

const bookReducer: React.Reducer<IBook[], BookActionType> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_BOOKS':
      return payload;
    case 'SET_MY_BOOKS':
      return payload;
    case 'ADD_BOOK':
      return [payload, ...state];
    case 'LIKE_BOOK':
      return state;
    case 'SET_FAVOURITE_BOOKS':
      return payload;
    case 'DELETE_BOOK':
      return state.filter((el) => el.id !== payload);

    default:
      return state;
  }
};

export default bookReducer;
