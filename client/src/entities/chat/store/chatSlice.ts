import { createSlice, createAsyncThunk, PayloadAction , createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';
import { ChatState, Message } from './../model/index'

const socket = io('http://localhost:3000');

export const fetchTrainers = createAsyncThunk('chat/fetchTrainers', async () => {
  const response = await axios.get('http://localhost:3000/api/trainers');
  return response.data;
});

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async () => {
  const response = await axios.get('http://localhost:3000/api/users');
  return response.data;
});

export const joinChat = createAsyncThunk(
  'chat/joinChat',
  async ({ userId, chatPartnerId }: { userId: number; chatPartnerId: number }) => {
    socket.emit('joinChat', { userId, chatPartnerId });
  }
);

export const leaveChat = createAsyncThunk(
  'chat/leaveChat',
  async ({ userId }: { userId: number }) => {
    socket.emit('leaveChat', { userId });
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ userId, chatPartnerId }: { userId: number; chatPartnerId: number }) => {
    socket.emit('userTyping', { userId, chatPartnerId });
  }
);

export const addReaction = createAsyncThunk(
  'chat/addReaction',
  async ({ messageId, userId, reaction }: { messageId: number; userId: number; reaction: string }) => {
    socket.emit('addReaction', { messageId, userId, reaction });
  }
);

export const fetchUsersWithChats = createAsyncThunk(
  'chat/fetchUsersWithChats',
  async (trainerId: number) => {
    const response = await axios.get(`http://localhost:3000/api/trainers/${trainerId}/chats`);
    return response.data;
  }
);

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

export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (userId: number) => {
    socket.emit('getUnreadCount', { userId });
  }
);

const initialState: ChatState = {
  messages: [],
  trainers: [],
  users: [],
  usersWithChats: [],
  loading: false,
  unreadCount: 0,
  chatPartner: null,
};

export const setChatPartner = createAction<number | null>('chat/setChatPartner');

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ id: number; isSent?: boolean; isRead?: boolean }>) => {
      const message = state.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        if (action.payload.isSent !== undefined) message.isSent = action.payload.isSent;
        if (action.payload.isRead !== undefined) message.isRead = action.payload.isRead;
      }
    },
    updateReactions: (state, action: PayloadAction<{ messageId: number; reactions: Record<number, string> }>) => {
      const message = state.messages.find((msg) => msg.id === action.payload.messageId);
      if (message) {
        message.reactions = action.payload.reactions;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
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
      .addCase(fetchUsersWithChats.fulfilled, (state, action) => {
        state.usersWithChats = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(setChatPartner, (state, action) => {
        state.chatPartner = action.payload;
      });
  },
});

export const { 
  addMessage, 
  updateMessageStatus, 
  updateReactions,
  updateUnreadCount 
} = chatSlice.actions;

export { socket };
export default chatSlice.reducer;