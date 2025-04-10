import { AdviceCard } from '@/entities/advice/ui/AdviceCard/AdviceCard';
import * as React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useUser } from '@/entities/user/hooks/useUser';
import { UserApi } from '@/entities/user/api/UserApi';
import { IUserProfile } from '@/entities/user/model';
import { getUserColor } from '@/shared/utils/userColor';
import { ChatPage } from '../ChatPage/ChatPage';
import { CalendarPage } from '../CalendarPage';
import AnthropometryPage from '../AnthropometryPage/AnthropometryPage';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getUnreadCount, setChatPartner, addMessage } from '../../entities/chat/store/chatSlice';
import { useLocation } from 'react-router-dom';
import { fonts } from '@/shared/styles/fonts';
import { useSocketChat } from './../../entities/chat/api/socketApi';
import { TrainingApi } from '@/entities/training/api/TrainingApi';

const styles = {
  container: {
    minHeight: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: '0px',
    paddingTop: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    gap: '0px',
    marginBottom: '0px',
    overflow: 'overlay',
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  profileCard: {
    width: '100%',
    maxWidth: '1090px',
    minHeight: '300px',
    maxHeight: '300px',
    padding: '30px',
    borderRadius: '16px',
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(9px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
    marginBottom: '20px',
  },
  avatar: {
    width: 200,
    height: 200,
    border: '4px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    '& .MuiAvatar-root': {
      fontSize: '80px',
    },
  },
  leftInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: '200px',
    flex: 1,
  },
  rightInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: '200px',
    flex: 1,
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    ...fonts.montserrat,
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    ...fonts.delaGothicOne,
    fontSize: '1.4rem',
    color: 'white',
  },
  userName: {
    ...fonts.delaGothicOne,
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: '20px',
  },
  userSurname: {
    ...fonts.delaGothicOne,
    fontSize: '1.8rem',
    color: 'rgba(255, 255, 255, 0.73)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  userEmail: {
    ...fonts.montserrat,

    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  profileLabel: {
    ...fonts.montserrat,
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.73)',
  },
  profileValue: {
    ...fonts.delaGothicOne,
    fontWeight: 500,
    fontSize: '1.4rem',
    color: 'rgb(255, 255, 255)',
    marginBottom: '8px',
  },
  statsContainer: {
    display: 'flex',
    gap: '40px',
    marginTop: '20px',
    marginBottom: '10px',
  },
  statCard: {
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '200px',
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(9px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '8px',
  },
  tabsContainer: {
    width: '100%',
    position: 'relative',
    marginTop: '10px',
    paddingTop: '0',
    marginBottom: '0',
  },
  tabs: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  tabsWrapper: {
    display: 'flex',
    width: '100%',
  },
  tab: {
    color: 'white',
    marginTop: '44px',
    fontSize: '1.1rem',
    fontWeight: 500,
    textTransform: 'none',
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(9px)',
    boxShadow: '0 0px 8px rgba(0, 0, 0, 0.4)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    border: '2px solid rgba(161, 161, 161, 0.93)',
    borderBottom: '0px solid rgba(161, 161, 161, 0.93)',
    marginRight: '4px',
    padding: '8px 16px',
    minHeight: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    flex: 1,
    position: 'relative',
    '& .MuiTypography-root': {
      transition: 'color 0.3s ease',
      fontSize: '1.3rem',
    },
  },
  activeTab: {
    color: 'white',
    fontWeight: 'bold',
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.55), rgba(187, 187, 187, 0.42) 70%)',
    marginBottom: '0px',
    position: 'relative',
    zIndex: 3,
  },
  tabText: {
    ...fonts.delaGothicOne,
    fontSize: '1.3rem',
    fontWeight: 500,
  },
  tabPanel: {
    width: '96%',
    padding: '20px',
    background:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(9px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    borderRadius: '0 0 16px 16px',
    marginTop: '0px',
    border: '2px solid rgba(161, 161, 161, 0.93)',
    borderTop: 'none',
    position: 'relative',
    zIndex: 1,
    minHeight: '80vh',
    right: '0',
    overflow: 'overlay',
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'transparent',
      position: 'absolute',
      right: 0,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '& h6': {
      color: 'white',
      textAlign: 'center',
      fontSize: '0.5rem',
      marginBottom: '20px',
    },
    '& p': {
      color: 'white',
      textAlign: 'center',
      fontSize: '1.3rem',
      marginBottom: '20px',
    },
    '& h1': {
      color: 'white',
      textAlign: 'center',
      fontSize: '2.0rem',
      marginBottom: '10px',
    },
    '& .MuiPaper-root': {
      boxShadow: '0 6px 20px rgba(5.7, 0.7, 0.7, 0.7)',
      borderRadius: '16px',
      overflow: 'hidden',
    },
  },
};
//ds
export default function ProfilePage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [trainingCount, setTrainingCount] = useState<number>(0);
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState<number | null>(0);
  const chatRef = React.useRef<HTMLDivElement>(null); // Добавляем ref для чата
  const calendarRef = useRef<HTMLDivElement>(null);

  const userId = user?.id;
  const { messages } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (location.state?.scrollToChat) {
      setActiveTab(3); // Открываем вкладку чата
      if (location.state?.trainerId && location.state?.openChatWithTrainer) {
        dispatch(setChatPartner(location.state.trainerId)); // Устанавливаем тренера как собеседника
      }
      // Увеличиваем задержку для прокрутки
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Увеличили задержку до 500мс
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUnreadCount(userId));
    }
  }, [userId, dispatch]);

  const unreadMessagesCount = messages.filter(
    (msg) => msg.receiverId === userId && !msg.isRead,
  ).length;

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const response = await UserApi.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    const loadTrainingCount = async (): Promise<void> => {
      if (user?.id) {
        try {
          const trainings = await TrainingApi.getUserTrainings(user.id);
          const completedTrainings = trainings.filter((training) => training.complete);
          setTrainingCount(completedTrainings.length);
        } catch (error) {
          console.error('Error loading training count:', error);
        }
      }
    };

    if (user) {
      loadProfile();
      loadTrainingCount();
    }
  }, [user]);

  const { onNewMessage, offNewMessage } = useSocketChat();

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
      dispatch(getUnreadCount(userId));
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
    };
  }, [dispatch, userId, onNewMessage, offNewMessage]);

  // Добавляем новый useEffect для отслеживания изменений в профиле
  useEffect(() => {
    if (!profile && user) {
      const loadProfile = async (): Promise<void> => {
        try {
          const response = await UserApi.getProfile();
          setProfile(response.data);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };
      loadProfile();
    }
  }, [profile, user]);

  useEffect(() => {
    const handleProfileUpdate = (): void => {
      const loadProfile = async (): Promise<void> => {
        try {
          const response = await UserApi.getProfile();
          setProfile(response.data);
          // Обновляем данные пользователя в контексте
          if (user) {
            const updatedUser = {
              ...user,
              name: response.data.name || user.name,
              email: response.data.email || user.email,
            };
            setUser(updatedUser);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };

      if (user) {
        loadProfile();
      }
    };

    // Подписываемся на событие обновления профиля
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Отписываемся при размонтировании компонента
    return (): void => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user, setUser]);

  useEffect(() => {
    if (location.state?.scrollToCalendar && calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);

  if (!user) {
    return <Typography>Пользователь не найден</Typography>;
  }

  const getGenderText = (gender: string): string => {
    switch (gender) {
      case 'male':
        return 'Мужской';
      case 'female':
        return 'Женский';
      default:
        return 'Другой';
    }
  };

  const getAvatarUrl = (): string => {
    if (profile?.avatar) {
      const baseUrl = import.meta.env.VITE_API.replace('/api', '');
      return `${baseUrl}${profile.avatar}`;
    }
    return '';
  };

  const getUserAvatarColor = (): string => {
    if (user?.email) {
      return getUserColor(user.email);
    }
    return '#BAE1FF';
  };

  const handleTabClick =
    (index: number) =>
    (event: React.MouseEvent): void => {
      event.preventDefault();
      setActiveTab(index);
    };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.profileCard}>
        <Box sx={styles.header}>
          <Box sx={styles.leftInfo}>
            <Box sx={styles.infoItem}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
                  backdropFilter: 'blur(9px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
                  textAlign: 'center',
                  minWidth: '120px',
                }}
              >
                <Typography
                  sx={{
                    ...styles.infoLabel,
                    fontSize: '1rem',
                  }}
                >
                  {user?.trener ? 'Стаж работы' : 'Стаж тренировок'}
                </Typography>
                <Typography
                  sx={{
                    ...styles.infoValue,
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {profile ? `${profile.trainingExperience} лет` : 'Не указан'}
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Box sx={styles.avatarContainer}>
            <Avatar
              src={getAvatarUrl()}
              alt={user?.name || 'User'}
              sx={{
                ...styles.avatar,
                bgcolor: getUserAvatarColor(),
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '80px', ...fonts.delaGothicOne }}>
                {user?.name?.[0] || 'U'}
              </Typography>
            </Avatar>
          </Box>

          <Box sx={styles.rightInfo}>
            <Box sx={styles.infoItem}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
                  backdropFilter: 'blur(9px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
                  textAlign: 'center',
                  minWidth: '120px',
                }}
              >
                <Typography
                  sx={{
                    ...styles.infoLabel,
                    fontSize: '1rem',
                  }}
                >
                  Количество тренировок
                </Typography>
                <Typography
                  sx={{
                    ...styles.infoValue,
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {trainingCount}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                ...styles.userName,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1,
              }}
            >
              {user?.name || 'Пользователь'}
            </Typography>
            <Typography
              sx={{
                ...styles.userSurname,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1,
              }}
            >
              {user?.surname || ''}
            </Typography>
          </Box>
          <Typography
            sx={{
              ...styles.userEmail,
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 0.5,
            }}
          >
            {user?.email || ''}
          </Typography>
        </Box>
      </Paper>

      <Box
        ref={chatRef} // Присваиваем ref для прокрутки к чату
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: '12.5%',
          marginBottom: '0px',
          paddingBottom: '0px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box sx={styles.tabsContainer}>
          <Box sx={styles.tabs}>
            <Box sx={styles.tabsWrapper}>
              <Box
                onClick={handleTabClick(0)}
                sx={{ ...styles.tab, ...(activeTab === 0 ? styles.activeTab : {}) }}
              >
                <Typography sx={styles.tabText}>Календарь тренировок</Typography>
              </Box>
              <Box
                onClick={handleTabClick(1)}
                sx={{ ...styles.tab, ...(activeTab === 1 ? styles.activeTab : {}) }}
              >
                <Typography sx={styles.tabText}>Журнал прогресса</Typography>
              </Box>
              <Box
                onClick={handleTabClick(2)}
                sx={{ ...styles.tab, ...(activeTab === 2 ? styles.activeTab : {}) }}
              >
                <Typography sx={styles.tabText}>Рекомендации</Typography>
              </Box>
              <Box
                onClick={handleTabClick(3)}
                sx={{ ...styles.tab, ...(activeTab === 3 ? styles.activeTab : {}) }}
              >
                <Typography sx={styles.tabText}>
                  {user?.trener ? 'Чат с клиентом' : 'Чат с тренером'}
                </Typography>

                {unreadMessagesCount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 8,
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadMessagesCount}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {activeTab !== null && (
          <Box
            ref={activeTab === 0 ? calendarRef : undefined}
            sx={{ ...styles.tabPanel, marginBottom: '30px' }}
          >
            {activeTab === 0 && <CalendarPage />}
            {activeTab === 1 && <AnthropometryPage />}
            {activeTab === 2 && <AdviceCard />}
            {activeTab === 3 && <ChatPage />}
          </Box>
        )}
      </Box>
    </Box>
  );
}
