import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

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
    color: "black",
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
};

export function MainPage(): React.JSX.Element {
  const navigate = useNavigate();

  const handleSignUp = (): void => {
    navigate(CLIENT_ROUTES.SIGN_UP);
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h1" sx={styles.title}>
        Фитнес должен быть доступен каждому
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={handleSignUp}
        sx={styles.button}
      >
        Создать профиль
      </Button>
    </Box>
  );
}
