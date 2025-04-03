import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, fetchTrainers, fetchUsers, fetchUsersWithChats, sendMessage, addMessage, socket } from '../../entities/chat/store/chatSlice';
import { RootState, AppDispatch } from '../../app/store';
import { useUser } from '@/entities/user/hooks/useUser';

export function ChatPage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const userId = user?.id;
  const isTrainer = user?.trener; // true - тренер, false - посетитель

  const { messages, trainers, usersWithChats } = useSelector((state: RootState) => state.chat);

  const [text, setText] = useState('');
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Record<number, number>>({});
  const [lastReadMessageId, setLastReadMessageId] = useState<number | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Реф для скролла к последнему сообщению

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchUsers());

    if (isTrainer && userId) {
      dispatch(fetchUsersWithChats(userId));
    }

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));

      setUnreadMessages((prev) => {
        if (message.senderId !== userId) {
          return {
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          };
        }
        return prev;
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch, isTrainer, userId]);

  const chatPartners = isTrainer ? usersWithChats : trainers;

  useEffect(() => {
    if (chatPartnerId) {
      dispatch(fetchMessages({ userId, chatPartnerId }));
      setUnreadMessages((prev) => ({ ...prev, [chatPartnerId]: 0 }));
    }
  }, [chatPartnerId, dispatch, userId]);

  // Обновление состояния lastReadMessageId при получении нового сообщения
  useEffect(() => {
    if (messages.length > 0) {
      setLastReadMessageId(messages[messages.length - 1].id);
    }
  }, [messages]);

  // Скролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (text.trim()) {
      dispatch(sendMessage({ senderId: userId, receiverId: chatPartnerId!, text }));
      setText(''); // Очистить инпут после отправки
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const markAsRead = (messageId: number) => {
    setLastReadMessageId(messageId);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Список чатов */}
      <div style={{ width: '250px', borderRight: '1px solid gray', paddingRight: '10px' }}>
        <h3>Диалоги</h3>
        {chatPartners.map((partner) => (
          <button
            key={partner.id}
            onClick={() => setChatPartnerId(partner.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid lightgray',
              backgroundColor: chatPartnerId === partner.id ? '#ddd' : 'white',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {partner.name}
            {unreadMessages[partner.id] > 0 && (
              <span
                style={{
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '5px',
                  fontSize: '12px',
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {unreadMessages[partner.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Окно чата */}
      <div style={{ flex: 1 }}>
        <h2>Чат</h2>
        {chatPartnerId ? (
          <>
            <div
              style={{
                height: '300px',
                overflowY: 'scroll',
                border: '1px solid gray',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {messages.map((msg) => (
                <p
                  key={msg.id}
                  onClick={() => markAsRead(msg.id)} // По клику на сообщение будем считать его прочитанным
                  style={{
                    backgroundColor: msg.id > (lastReadMessageId || 0) ? 'lightgray' : 'transparent', // Подсвечиваем новые сообщения
                    padding: '5px',
                    borderRadius: '5px',
                    marginBottom: '-20px', // Ближе друг к другу
                  }}
                >
                  <strong>{msg.senderId === userId ? 'Вы' : 'Собеседник'}:</strong> {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '10px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Отправить
            </button>
          </>
        ) : (
          <p>Выберите диалог</p>
        )}
      </div>
    </div>
  );
}