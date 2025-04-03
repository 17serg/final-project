import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt?: string;
}

interface User {
  id: number;
  name: string;
  trener: boolean; // Тренер (true) или посетитель (false)
}

interface ChatState {
  messages: Message[];
  trainers: User[]; // Все тренеры
  users: User[]; // Все пользователи
  loading: boolean;
}

const initialState: ChatState = {
  messages: [],
  trainers: [],
  users: [],
  loading: false,
};

const socket = io('http://localhost:3000');

export const fetchTrainers = createAsyncThunk('chat/fetchTrainers', async () => {
  const response = await axios.get('http://localhost:3000/api/trainers');
  return response.data;
});

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async () => {
  const response = await axios.get('http://localhost:3000/api/users'); // Добавили запрос всех пользователей
  return response.data;
});

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ userId, chatPartnerId }: { userId: number; chatPartnerId: number }) => {
    const response = await axios.get(`http://localhost:3000/api/messages/${userId}/${chatPartnerId}`);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk('chat/sendMessage', async (message: Message) => {
  socket.emit('sendMessage', message);
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.trainers = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export { socket };
export default chatSlice.reducer;