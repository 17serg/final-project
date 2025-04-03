import * as React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { useUser } from "@/entities/user/hooks/useUser";
import { UserApi } from "@/entities/user/api/UserApi";
import { IUserProfile } from "@/entities/user/model";

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "20px",
    gap: "40px",
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
};

export default function ProfilePage(): React.JSX.Element {
  const { user } = useUser();
  const [profile, setProfile] = React.useState<IUserProfile | null>(null);

  React.useEffect(() => {
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

  // Формируем URL для аватара
  const getAvatarUrl = (): string => {
    if (profile?.avatar) {
      // Используем URL аватарки напрямую
      return profile.avatar;
    }
    // Если аватар не загружен, используем первую букву имени
    return "";
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.profileCard}>
        <Box sx={styles.header}>
          <Avatar 
            src={getAvatarUrl()} 
            alt={user.name} 
            sx={styles.avatar}
          >
            {user.name?.[0] || "U"}
          </Avatar>
          
          <Box sx={styles.userInfo}>
            <Typography sx={styles.userName}>{user.name}</Typography>
            <Typography sx={styles.userEmail}>{user.email}</Typography>
            
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
    </Box>
  );
}
