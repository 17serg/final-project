import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addMessage, 
  updateMessageStatus, 
  updateReactions, 
  updateUnreadCount,
  socket
} from '../../chat/store/chatSlice';
import { AppDispatch } from '../../../app/store';

export const useSocketChat = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('messageSent', ({ id }) => {
      dispatch(updateMessageStatus({ id, isSent: true }));
    });

    socket.on('messageRead', ({ id }) => {
      dispatch(updateMessageStatus({ id, isRead: true }));
    });

    socket.on('reactionUpdated', ({ messageId, reactions }) => {
      dispatch(updateReactions({ messageId, reactions }));
    });

    socket.on('unreadCount', ({ count }) => {
        console.log('новое уведомление')
      dispatch(updateUnreadCount(count));
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageSent');
      socket.off('messageRead');
      socket.off('reactionUpdated');
      socket.off('unreadCount');
    };
  }, [dispatch]);

  const emitCheckMessages = (userId: number, chatPartnerId: number) => {
    socket.emit('checkMessages', { userId, chatPartnerId });
  };

  return { emitCheckMessages };
};