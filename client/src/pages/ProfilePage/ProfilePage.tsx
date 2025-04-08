import * as React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { useUser } from "@/entities/user/hooks/useUser";
import { UserApi } from "@/entities/user/api/UserApi";
import { IUserProfile } from "@/entities/user/model";
import { getUserColor } from "@/shared/utils/userColor";
import { ChatPage } from "../ChatPage/ChatPage";
import { CalendarPage } from "../CalendarPage";
import AnthropometryPage from "../AnthropometryPage/AnthropometryPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { getUnreadCount, setChatPartner } from '../../entities/chat/store/chatSlice';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    minHeight: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: "0px",
    paddingTop: "10px",
    paddingLeft: "20px",
    paddingRight: "20px",
    gap: "0px",
    marginBottom: "0px",
  },
  profileCard: {
    width: "100%",
    maxWidth: "800px",
    padding: "30px",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.7)",
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },
  avatar: {
    width: 300,
    height: 300,
    border: "4px solid rgb(42, 41, 223)",
    "& .MuiAvatar-root": {
      fontSize: "120px",
    },
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userName: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
  },
  userEmail: {
    fontSize: "1.2rem",
    color: "gray",
    marginBottom: "16px",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  profileLabel: {
    fontSize: "1.2rem",
    color: "gray",
  },
  profileValue: {
    fontSize: "1.4rem",
    color: "black",
    marginBottom: "8px",
  },
  statsContainer: {
    display: "flex",
    gap: "40px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  statCard: {
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    minWidth: "200px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.7)",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "rgb(42, 41, 223)",
  },
  statLabel: {
    fontSize: "1.2rem",
    color: "black",
    marginTop: "8px",
  },
  tabsContainer: {
    width: "100%",
    position: "relative",
    marginTop: "10px",
    paddingTop: "0",
    marginBottom: "0",
  },
  tabs: {
    position: "relative",
    zIndex: 2,
    width: "100%",
  },
  tabsWrapper: {
    display: "flex",
    width: "100%",
  },
  tab: {
    marginTop: "0",
    fontSize: "1.1rem",
    fontWeight: 500,
    textTransform: "none",
    backgroundColor: "white",
    boxShadow: "0 0px 8px rgba(0, 0, 0, 0.4)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    border: "2px solid rgb(42, 41, 223)",
    borderBottom: "0px solid rgb(42, 41, 223)",
    marginRight: "4px",
    padding: "8px 16px",
    minHeight: "40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.3s ease",
    flex: 1,
    position: "relative",
    "& .MuiTypography-root": {
      transition: "color 0.3s ease",
      fontSize: "1.3rem",
    },
  },
  activeTab: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "rgba(42, 41, 223, 0.7)",
    marginBottom: "0px",
    position: "relative",
    zIndex: 3,
  },
  tabPanel: {
    width: "95.9%",
    padding: "20px",
    backgroundColor: "rgba(42, 41, 223, 0.7)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    borderRadius: "0 0 16px 16px",
    marginTop: "0px",
    border: "2px solid rgb(42, 41, 223)",
    borderTop: "none",
    position: "relative",
    zIndex: 1,
    minHeight: "auto",
    right: "0",
    "& h6": {
      color: "white",
      textAlign: "center",
      fontSize: "0.5rem",
      marginBottom: "20px",
    },
    "& p": {
      color: "white",
      textAlign: "center",
      fontSize: "1.3rem",
      marginBottom: "20px",
    },
    "& h1": {
      color: "white",
      textAlign: "center",
      fontSize: "2.0rem",
      marginBottom: "10px",
    },
    "& .MuiPaper-root": {
      boxShadow: "0 6px 20px rgba(5.7, 0.7, 0.7, 0.7)",
      borderRadius: "16px",
      overflow: "hidden",
    },
  },
};

export default function ProfilePage(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const location = useLocation();
  const [profile, setProfile] = React.useState<IUserProfile | null>(null);
  const [activeTab, setActiveTab] = React.useState<number | null>(null);
  const chatRef = React.useRef<HTMLDivElement>(null); // Добавляем ref для чата

  const userId = user?.id;
  const { messages } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    console.log('ProfilePage location state:', location.state);
    if (location.state?.scrollToChat) {
      setActiveTab(3); // Открываем вкладку чата
      if (location.state?.trainerId && location.state?.openChatWithTrainer) {
        dispatch(setChatPartner(location.state.trainerId)); // Устанавливаем тренера как собеседника
      }
      // Прокручиваем к чату
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUnreadCount(userId)); 
    }
  }, [userId, dispatch]);

  const unreadMessagesCount = messages.filter(
    (msg) => msg.receiverId === userId && !msg.isRead
  ).length;

  React.useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const response = await UserApi.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  if (!user) {
    return <Typography>Пользователь не найден</Typography>;
  }

  const getGenderText = (gender: string): string => {
    switch (gender) {
      case "male":
        return "Мужской";
      case "female":
        return "Женский";
      default:
        return "Другой";
    }
  };

  const getAvatarUrl = (): string => {
    if (profile?.avatar) {
      const baseUrl = import.meta.env.VITE_API.replace("/api", "");
      return `${baseUrl}${profile.avatar}`;
    }
    return "";
  };

  const getUserAvatarColor = (): string => {
    if (user?.email) {
      return getUserColor(user.email);
    }
    return "#BAE1FF";
  };

  const handleTabClick = (index: number) => (event: React.MouseEvent): void => {
    event.preventDefault();
    setActiveTab((prev) => (prev === index ? null : index));
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.profileCard}>
        <Box sx={styles.header}>
          <Avatar
            src={getAvatarUrl()}
            alt={user.name}
            sx={{
              ...styles.avatar,
              bgcolor: getUserAvatarColor(),
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: "120px", fontWeight: "bold" }}
            >
              {user.name?.[0] || "U"}
            </Typography>
          </Avatar>

          <Box sx={styles.userInfo}>
            <Typography sx={styles.userName}>{user.name}</Typography>
            <Typography sx={styles.userEmail}>{user.email}</Typography>

            <Box sx={styles.profileInfo}>
              <Typography sx={styles.profileLabel}>Пол</Typography>
              <Typography sx={styles.profileValue}>
                {profile ? getGenderText(profile.gender) : "Не указан"}
              </Typography>

              <Typography sx={styles.profileLabel}>Стаж тренировок</Typography>
              <Typography sx={styles.profileValue}>
                {profile ? `${profile.trainingExperience} лет` : "Не указан"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={styles.statsContainer}>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>
            {profile?.personalRecords || 0}
          </Typography>
          <Typography sx={styles.statLabel}>Личные рекорды</Typography>
        </Paper>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>
            {profile?.trainingCount || 0}
          </Typography>
          <Typography sx={styles.statLabel}>Количество тренировок</Typography>
        </Paper>
      </Box>

      <Box 
        ref={chatRef} // Присваиваем ref для прокрутки к чату
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          width: "100%", 
          marginTop: "12.5%",
          marginBottom: "0px", 
          paddingBottom: "0px",
          position: "relative",
          zIndex: 10
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
                <Typography>Чат с тренером</Typography>

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
          <Box sx={{ ...styles.tabPanel, marginBottom: "30px" }}>
            {activeTab === 0 && <CalendarPage />}
            {activeTab === 1 && <AnthropometryPage />}
            {activeTab === 2 && <Typography>Рекомендации</Typography>}
            {activeTab === 3 && <ChatPage />}
          </Box>
        )}
      </Box>
    </Box>
  );
}