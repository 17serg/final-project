import * as React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { useUser } from "@/entities/user/hooks/useUser";

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
};

export default function ProfilePage(): React.JSX.Element {
  const { user } = useUser();

  if (!user) {
    return <Typography>Пользователь не найден</Typography>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.userInfo}>
        <Typography sx={styles.userName}>{user.name}</Typography>
        <Typography sx={styles.userEmail}>{user.email}</Typography>
      </Box>
      
      <Avatar 
        src={user.avatar || ""} 
        alt={user.name} 
        sx={styles.avatar}
      >
        {user.name?.[0] || "U"}
      </Avatar>

      <Box sx={styles.statsContainer}>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>12</Typography>
          <Typography sx={styles.statLabel}>Личные рекорды</Typography>
        </Paper>
        <Paper sx={styles.statCard}>
          <Typography sx={styles.statValue}>48</Typography>
          <Typography sx={styles.statLabel}>Количество тренировок</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
