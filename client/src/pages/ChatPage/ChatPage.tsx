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

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export function ChatPage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const { emitCheckMessages } = useSocketChat();
  const userId = user?.id;
  const isTrainer = user?.trener;

  const { messages, trainers, usersWithChats } = useSelector((state: RootState) => state.chat);

  const [text, setText] = useState('');
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  // Получение количества непрочитанных сообщений
  useEffect(() => {
    if (userId) {
      console.log(userId ,'+++++')
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages]);

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
    const reactionCounts = Object.values(reactions).reduce((acc, reaction) => {
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '250px', borderRight: '1px solid gray', paddingRight: '10px' }}>
        <h3>Диалоги</h3>
        {chatList.map((partner) => (
          <button
            key={partner.id}
            onClick={() => setChatPartnerId(partner.id)}
            style={{
              display: 'flex',
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid lightgray',
              backgroundColor: chatPartnerId === partner.id ? '#ddd' : 'white',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span style={{ flex: 1 }}>{partner.name} {partner.surname}</span>
            {unreadMessagesCount(partner.id) > 0 && (
              <span style={{
                position: 'absolute',
                right: '10px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
              }}>
                {unreadMessagesCount(partner.id)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <h2>Чат</h2>
        {chatPartnerId ? (
          <>
            <div style={{
              height: '300px',
              overflowY: 'scroll',
              border: '1px solid gray',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {filteredMessages.map((msg) => (
                <div key={msg.id} style={{ padding: '5px', borderRadius: '5px' }}>
                  <p>
                    <strong>{msg.senderId === userId ? 'Вы' : 'Собеседник'}:</strong> {msg.text}
                    <br />
                    <span style={{ fontSize: '12px', color: 'gray' }}>
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

            <input
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />
            <button
              onClick={handleSendMessage}
              style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}
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