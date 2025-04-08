export interface Message {
    id?: number;
    senderId: number;
    receiverId: number;
    text: string;
    createdAt?: string;
    isSent: boolean;
    isRead: boolean;
    reactions?: Record<number, string>;
  }
  
  export interface User {
    id: number;
    name: string;
    trener: boolean;
    surname: string;
  }
  
  export interface ChatState {
    messages: Message[];
    trainers: User[];
    users: User[];
    usersWithChats: User[];
    loading: boolean;
    unreadCount: number;
    chatPartner: number | null;
  }
  
 