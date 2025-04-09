import { AdviceCard } from '@/entities/advice/ui/AdviceCard/AdviceCard';
import * as React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { useUser } from "@/entities/user/hooks/useUser";
import { UserApi } from "@/entities/user/api/UserApi";
import { IUserProfile } from "@/entities/user/model";
import { getUserColor } from "@/shared/utils/userColor";
import { ChatPage } from "../ChatPage/ChatPage";
import { CalendarPage } from "../CalendarPage";
import AnthropometryPage from "../AnthropometryPage/AnthropometryPage";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { getUnreadCount, setChatPartner, addMessage } from '../../entities/chat/store/chatSlice';
import { useLocation } from 'react-router-dom';
import { useSocketChat } from './../../entities/chat/api/socketApi';

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
    maxWidth: '800px',
    minHeight: '293px',
    maxHeight: '293px',
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
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px',
  },
  avatar: {
    width: 300,
    height: 300,
    border: '4px solid rgba(160, 158, 158, 0.57)',
    '& .MuiAvatar-root': {
      fontSize: '120px',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
  },
  userEmail: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '16px',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  profileLabel: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  profileValue: {
    fontSize: '1.4rem',
    color: 'rgba(255, 255, 255, 0.7)',
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
  tabPanel: {
    width: '95.8%',
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

    if (user) {
      loadProfile();
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
      setActiveTab((prev) => (prev === index ? null : index));
    };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.profileCard}>
        <Box sx={styles.header}>
          <Avatar
            src={getAvatarUrl()}
            alt={user?.name || 'User'}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              bgcolor: getUserAvatarColor(),
              mb: 2,
            }}
          >
            <Typography variant="h1" sx={{ fontSize: '48px', fontWeight: 'bold' }}>
              {user?.name?.[0] || 'U'}
            </Typography>
          </Avatar>

          <Box sx={styles.userInfo}>
            <Typography sx={styles.userName}>{user?.name || 'Пользователь'}</Typography>
            <Typography sx={styles.userEmail}>{user?.email || ''}</Typography>

            <Box sx={styles.profileInfo}>
              <Typography sx={styles.profileLabel}>Пол</Typography>
              <Typography sx={styles.profileValue}>
                {profile ? getGenderText(profile.gender) : 'Не указан'}
              </Typography>

              <Typography sx={styles.profileLabel}>Стаж тренировок</Typography>
              <Typography sx={styles.profileValue}>
                {profile ? `${profile.trainingExperience} лет` : 'Не указан'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={styles.statsContainer}>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>{profile?.personalRecords || 0}</Typography>
          <Typography sx={styles.statLabel}>Личные рекорды</Typography>
        </Paper>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>{profile?.trainingCount || 0}</Typography>
          <Typography sx={styles.statLabel}>Количество тренировок</Typography>
        </Paper>
      </Box>
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
                <Typography>Календарь тренировок</Typography>
              </Box>
              <Box
                onClick={handleTabClick(1)}
                sx={{ ...styles.tab, ...(activeTab === 1 ? styles.activeTab : {}) }}
              >
                <Typography>Журнал прогресса</Typography>
              </Box>
              <Box
                onClick={handleTabClick(2)}
                sx={{ ...styles.tab, ...(activeTab === 2 ? styles.activeTab : {}) }}
              >
                <Typography>Рекомендации</Typography>
              </Box>
              <Box
                onClick={handleTabClick(3)}
                sx={{ ...styles.tab, ...(activeTab === 3 ? styles.activeTab : {}) }}
              >

                <Typography>
                  {user?.trener ? "Чат с клиентом" : "Чат с тренером"}
                </Typography>

                {unreadMessagesCount > 0 && (
                  <Box
                    component="span"
                    sx={{

                      position: "absolute",
                      top: 4,
                      right: 8,
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

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
