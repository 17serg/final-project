import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useUser } from '@/entities/user/hooks/useUser';

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    top: "60%",
    transform: "translateY(-50%)",
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    maxWidth: "90%",
    wordWrap: "break-word",
  },
  subtitle: {
    position: "absolute",
    top: "70%",
    transform: "translateY(-50%)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    maxWidth: "90%",
    wordWrap: "break-word",
  },
  button: {
    position: "absolute",
    top: "75%",
    transform: "translateY(-50%)",
    padding: "16px 32px",
    fontSize: "1.5rem",
    backgroundColor: "rgb(42, 41, 223)",
    color: "white",
    borderRadius: "16px",
    "&:hover": {
      backgroundColor: "rgb(32, 31, 173)",
    },
  },
  buttonsContainer: {
    position: "absolute",
    top: "72%",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
};

export function MainPage(): React.JSX.Element {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h1" sx={styles.title}>
        Фитнес должен быть доступен каждому
      </Typography>
      {!user && (
        <>
          <Box sx={styles.buttonsContainer}>
            <Button
              variant="contained"
              onClick={() => handleNavigate('/signup')}
              sx={styles.button}
            >
              Создать профиль
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
