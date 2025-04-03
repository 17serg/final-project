import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, fetchTrainers, fetchUsers, sendMessage, addMessage, socket } from '../../entities/chat/store/chatSlice';
import { RootState, AppDispatch } from '../../app/store';
import { useUser } from '@/entities/user/hooks/useUser';

export function ChatPage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const userId = user?.id;
  const isTrainer = user?.trener; // true - тренер, false - посетитель

  const { messages, trainers, users } = useSelector((state: RootState) => state.chat);
  const [text, setText] = useState('');
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchUsers());

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  useEffect(() => {
    if (chatPartnerId) {
      dispatch(fetchMessages({ userId, chatPartnerId }));
    }
  }, [chatPartnerId, dispatch, userId]);

  // Фильтрация списка собеседников
  const chatPartners = isTrainer
    ? users.filter((u) => !u.trener && messages.some((m) => m.senderId === u.id || m.receiverId === u.id)) // Тренер видит только тех посетителей, кто ему писал
    : trainers; // Посетитель видит только тренеров

  return (
    <div>
      <h2>Чат</h2>
      <select onChange={(e) => setChatPartnerId(Number(e.target.value))}>
        <option value="">Выберите собеседника</option>
        {chatPartners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name}
          </option>
        ))}
      </select>

      {chatPartnerId && (
        <>
          <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid gray', padding: '10px' }}>
            {messages.map((msg) => (
              <p key={msg.id}>
                <strong>{msg.senderId === userId ? 'Вы' : 'Собеседник'}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => dispatch(sendMessage({ senderId: userId, receiverId: chatPartnerId!, text }))}>
            Отправить
          </button>
        </>
      )}
    </div>
  );
}