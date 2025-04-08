import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMessages, 
  fetchTrainers, 
  fetchUsers, 
  fetchUsersWithChats, 
  sendMessage, 
  markMessagesAsRead,
  joinChat,
  leaveChat,
  addReaction,
  getUnreadCount,
  Message
} from '../../entities/chat/store/chatSlice';
import { RootState, AppDispatch } from '../../app/store';
import { useUser } from '@/entities/user/hooks/useUser';
import { useSocketChat } from './../../entities/chat/api/socketApi';
import { useLocation } from 'react-router-dom';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export function ChatPage(): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const { emitCheckMessages } = useSocketChat();
  const userId = user?.id;
  const isTrainer = user?.trener;

  const { messages, trainers, usersWithChats } = useSelector((state: RootState) => state.chat);

  const [text, setText] = useState('');
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const lastMessageRef = useRef<boolean>(false); // Флаг для отслеживания последнего сообщения

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchUsers());

    if (isTrainer && userId) {
      dispatch(fetchUsersWithChats(userId));
    }
  }, []);

  // Обработка входа/выхода из чата
  useEffect(() => {
    if (chatPartnerId && userId) {
      dispatch(joinChat({ userId, chatPartnerId }));
      dispatch(fetchMessages({ userId, chatPartnerId }));
      emitCheckMessages(userId, chatPartnerId);
      
      return () => {
        dispatch(leaveChat({ userId }));
      };
    }
  }, [chatPartnerId, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUnreadCount(userId));
    }
  }, [userId]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (chatPartnerId && userId) {
      dispatch(markMessagesAsRead({ userId, chatPartnerId }));
    }
  }, [chatPartnerId, userId]);

  const filteredMessages = useMemo(() => 
    messages.filter(msg => 
      (msg.senderId === userId && msg.receiverId === chatPartnerId) ||
      (msg.senderId === chatPartnerId && msg.receiverId === userId)
    ),
    [messages, userId, chatPartnerId]
  );

  useEffect(() => {
    // Если есть последнее сообщение, скроллим вниз
    if (messagesEndRef.current) {
      if (lastMessageRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [filteredMessages]);

  useEffect(() => {
    const { trainerId, openChatWithTrainer } = location.state || {};
    if (trainerId && openChatWithTrainer) {
      setChatPartnerId(trainerId);
    }
  }, [location.state]);

  const handleSendMessage = useCallback(() => {
    if (text.trim() && chatPartnerId !== null && userId !== undefined) {
      const newMessage = {
        senderId: userId,
        receiverId: chatPartnerId,
        text,
        isSent: false,
        isRead: false,
        createdAt: new Date().toISOString(),
        reactions: {},
      };

      dispatch(sendMessage(newMessage));
      setText('');
      lastMessageRef.current = true; // Устанавливаем флаг для прокрутки вниз
    }
  }, [text, chatPartnerId, userId]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleAddReaction = useCallback((messageId: number, reaction: string) => {
    if (userId) {
      dispatch(addReaction({ messageId, userId, reaction }));
    }
  }, [userId]);

  const formatTime = useCallback((dateString: string | undefined) => {
    if (!dateString) return 'Неизвестное время';
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  const MessageReactions = useCallback(({ message }: { message: Message }) => {
    const reactions = message.reactions || {};
    const reactionCounts = Object.values(reactions).reduce<Record<string, number>>((acc, reaction) => {
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    }, {});

    return (
      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
        {Object.entries(reactionCounts).map(([reaction, count]) => (
          <span
            key={reaction}
            style={{ cursor: 'pointer' }}
            onClick={() => handleAddReaction(message.id!, reaction)}
          >
            {reaction} {count > 1 && count}
          </span>
        ))}
      </div>
    );
  }, [handleAddReaction]);

  const ReactionPicker = useCallback(({ messageId }: { messageId: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: '2px 5px', cursor: 'pointer' }}
        >
          😊
        </button>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              backgroundColor: 'white',
              border: '1px solid gray',
              borderRadius: '5px',
              padding: '5px',
              display: 'flex',
              gap: '5px',
              zIndex: 1000,
            }}
          >
            {REACTIONS.map((reaction) => (
              <span
                key={reaction}
                onClick={() => {
                  handleAddReaction(messageId, reaction);
                  setIsOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }, [handleAddReaction]);

  const chatList = useMemo(() => isTrainer ? usersWithChats : trainers, [isTrainer, usersWithChats, trainers]);

  const unreadMessagesCount = useCallback((partnerId: number) => 
    messages.filter(msg => 
      msg.senderId === partnerId && 
      msg.receiverId === userId && 
      !msg.isRead
    ).length,
    [messages, userId]
  );

  return (
    <div style={{ display: 'flex', gap: '20px', backgroundColor: '#f3f4f8', height: '50vh' }}>
      {/* Список диалогов */}
      <div
        style={{
          width: '200px',
          borderRight: '1px solid #e0e0e0',
          paddingRight: '10px',
          backgroundColor: 'white',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ padding: '15px 0', textAlign: 'center', color: '#4a4a4a' }}>Диалоги</h3>
        {chatList.map((partner) => (
          <button
            key={partner.id}
            onClick={() => setChatPartnerId(partner.id)}
            style={{
              display: 'flex',
              width: '100%',
              padding: '15px',
              margin: '5px 0',
              border: 'none',
              backgroundColor: chatPartnerId === partner.id ? '#e6f0ff' : 'white',
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'background-color 0.3s ease',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
            }}
          >
            <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>
              {partner.name} {partner.surname}
            </span>
            {unreadMessagesCount(partner.id) > 0 && (
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  backgroundColor: '#ff4747',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '5px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {unreadMessagesCount(partner.id)}
              </span>
            )}
          </button>
        ))}
      </div>
  
      {/* Чат с собеседником */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Чат</h2>
        {chatPartnerId ? (
          <>
            <div
              style={{
                height: '35vh', // Уменьшена высота чата
                overflowY: 'scroll',
                borderRadius: '10px',
                backgroundColor: '#fff',
                padding: '15px',
                boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column-reverse',
              }}
            >
              {filteredMessages.map((msg, index) => (
                <div
                  key={`${msg.id}-${userId}-${index}`}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '20px',
                    backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#fff',
                    margin: '5px 0',
                    maxWidth: '80%',
                    alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                    position: 'relative',
                  }}
                >
                  <p
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#333',
                      lineHeight: '1.4',
                    }}
                  >
                    <strong>{msg.senderId === userId ? 'Вы' : 'Собеседник'}:</strong> {msg.text}
                    <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {formatTime(msg.createdAt)}{' '}
                      {msg.senderId === userId && (
                        <>
                          {msg.isSent ? '✅' : '⌛'} {msg.isRead ? '✅' : ''}
                        </>
                      )}
                    </span>
                  </p>
                  <MessageReactions message={msg} />
                  <ReactionPicker messageId={msg.id!} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
  
            <div style={{ display: 'flex', marginTop: '15px' }}>
              <input
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '20px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  marginRight: '10px',
                  backgroundColor: '#f9f9f9',
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                Отправить
              </button>
            </div>
          </>
        ) : (
          <p style={{ color: '#777' }}>Выберите диалог</p>
        )}
      </div>
    </div>
  );
}
