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
import { CircularProgress } from '@mui/material';


const REACTIONS = [
  '👍', '❤️', '😂', '😮', '😢', '😡', '😍', '🥺', '😭', '🤔', '😎', '😜', '😋', '🙄', 
  '🤯', '🥳', '😈', '💩', '🤖', '👻', '🦄', '💀', '😱', '🥴', '💪', '👀', '🙏', '💥', 
];

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
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    dispatch(fetchTrainers());
    dispatch(fetchUsers());

    if (isTrainer && userId) {
      dispatch(fetchUsersWithChats(userId));
    }
  }, []);

  useEffect(() => {
    if (chatPartnerId && userId) {
      setLoadingMessages(true);
      dispatch(joinChat({ userId, chatPartnerId }));
      dispatch(fetchMessages({ userId, chatPartnerId })).then(() => {
        setLoadingMessages(false);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      });
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
    messages
      .filter(msg => 
        (msg.senderId === userId && msg.receiverId === chatPartnerId) ||
        (msg.senderId === chatPartnerId && msg.receiverId === userId)
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      })
      .reverse(),
    [messages, userId, chatPartnerId]
  );

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages, scrollToBottom]);

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
      scrollToBottom();
    }
  }, [text, chatPartnerId, userId, scrollToBottom]);

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
      acc[reaction as string] = (acc[reaction as string] || 0) + 1;
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

  const DoubleCheckIcon = ({ read }: { read: boolean }) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      style={{
        marginLeft: '8px',
        transform: 'translateY(-1px)',
      }}
    >
      <path
        d="M4 12l5 5L20 6"
        fill="none"
        stroke={read ? '#0088cc' : '#aaa'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {read && (
        <path
          d="M1 13l5 5L17 7"
          fill="none"
          stroke="#0088cc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: 'translateX(7px) translateY(0px)',
          }}
        />
      )}
    </svg>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#f3f4f8', height: '50vh' }}>
      {/* Список диалогов */}
      <div
  style={{
    width: '270px',
    borderRight: '1px solid #e0e0e0',
    paddingRight: '10px',
    backgroundColor: '#2c2c2c', // Темно-серый фон
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  }}
>
  <h3 style={{ padding: '15px 0', textAlign: 'center', color: '#ffffff' }}>Диалоги</h3>
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
        backgroundColor: chatPartnerId === partner.id ? '#3c3c3c' : '#2c2c2c', // Выделенный чат светлее
        cursor: 'pointer',
        borderRadius: '10px',
        transition: 'background-color 0.3s ease',
        alignItems: 'center',
        position: 'relative',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
      }}
    >
      <span style={{ flex: 1, fontWeight: '500', color: '#ffffff' , fontSize: '16px' ,  letterSpacing: '3px'}}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#111' }}>
  <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#999' }}>Чат</h2>
  {chatPartnerId ? (
    <>
      {loadingMessages ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </div>
      ) : (
        <div
          ref={messagesContainerRef}
          style={{
            height: '35vh',
            overflowY: 'auto',
            borderRadius: '10px',
            backgroundColor: '#2c2c2c',
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
                backgroundColor: msg.senderId === userId ? '#3c3c3c' : '#1c1c1c',
                margin: '5px 0',
                maxWidth: '80%',
                alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => {
                const reactions = document.getElementById(`reactions-${msg.id}`);
                if (reactions) {
                  reactions.style.display = reactions.style.display === 'none' ? 'flex' : 'none';
                }
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#ffffff',
                  lineHeight: '1.4',
                }}
              >
                <strong style={{ color: msg.senderId === userId ? '#4CAF50' : '#2196F3' }}>

                </strong> {msg.text}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                marginTop: '5px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#888',
                  marginRight: '5px'
                }}>
                  {formatTime(msg.createdAt)}
                </span>
                {msg.senderId === userId && (
                  <DoubleCheckIcon read={msg.isRead} />
                )}
              </div>
              <div
                id={`reactions-${msg.id}`}
                style={{
                  display: 'none',
                  position: 'absolute',
                  bottom: '100%',
                  left: msg.senderId === userId ? 'auto' : '0',
                  right: msg.senderId === userId ? '0' : 'auto',
                  backgroundColor: '#2c2c2c',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '5px',
                  gap: '5px',
                  zIndex: 1000,
                  flexWrap: 'wrap',
                  width: '200px',
                }}
              >
                {REACTIONS.map((reaction) => (
                  <span
                    key={reaction}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddReaction(msg.id!, reaction);
                      const reactions = document.getElementById(`reactions-${msg.id}`);
                      if (reactions) {
                        reactions.style.display = 'none';
                      }
                    }}
                    style={{ 
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '5px',
                      borderRadius: '5px',
                      // '&:hover': {
                      //   backgroundColor: '#3c3c3c'
                      // }
                    }}
                  >
                    {reaction}
                  </span>
                ))}
              </div>
              <MessageReactions message={msg} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div style={{ display: 'flex', marginTop: '15px' }}>
        <input
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '20px',
            border: '1px solid #444',
            fontSize: '14px',
            marginRight: '10px',
            backgroundColor: '#2c2c2c',
            color: '#ffffff',
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