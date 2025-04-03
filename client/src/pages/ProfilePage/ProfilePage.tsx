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
    alignItems: "center",
    padding: "20px",
    gap: "40px",
  },
  avatar: {
    width: 200,
    height: 200,
    border: "4px solid rgb(42, 41, 223)",
    marginTop: "40px",
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
  userInfo: {
    textAlign: "center",
    marginTop: "20px",
  },
  userName: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "8px",
  },
  userEmail: {
    fontSize: "1.2rem",
    color: "gray",
  },
  profileInfo: {
    textAlign: "center",
    marginTop: "20px",
  },
  profileLabel: {
    fontSize: "1.2rem",
    color: "gray",
    marginBottom: "4px",
  },
  profileValue: {
    fontSize: "1.4rem",
    color: "black",
    marginBottom: "16px",
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
      <Box sx={styles.userInfo}>
        <Typography sx={styles.userName}>{user.name}</Typography>
        <Typography sx={styles.userEmail}>{user.email}</Typography>
      </Box>
      
      <Avatar 
        src={getAvatarUrl()} 
        alt={user.name} 
        sx={styles.avatar}
      >
        {user.name?.[0] || "U"}
      </Avatar>

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
