import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
// import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { useUser } from '@/entities/user/hooks/useUser';
import { fonts } from '@/shared/styles/fonts';
import antropometric from "../../assets/screenshot/AnthropometryPage.png";
import calendar from "../../assets/screenshot/calendar.png";
import chat from "../../assets/screenshot/chat.png";
import advice from "../../assets/screenshot/advice.png"
// import category from "../../assets/screenshot/category.png"

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "40px 20px",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "80px",
  },
  title: {
    ...fonts.delaGothicOne,
    fontWeight: '400',
    lineHeight: '1.2',
    fontSize: '3.5rem',
    color: 'white',
    textAlign: 'center',
    marginBottom: '2rem',
    marginTop: '28rem',
  },
  button: {
    padding: "16px 32px",
    fontSize: "1.5rem",
    textDecoration: "none",
    textTransform: "none",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    color: "rgba(0, 0, 0, 0.9)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "2px solid rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "rgb(0, 0, 0)",
      color: "rgba(255, 255, 255, 0.9)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      border: "2px solid rgba(0, 0, 0, 0.2)",
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1200px",
    gap: "40px",
    marginBottom: "80px",
  },
  textContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  subtitle: {
    ...fonts.delaGothicOne,
    fontSize: "2.5rem",
    fontWeight: "400",
    color: "white",
    lineHeight: "1.2",
  },
  description: {
    ...fonts.delaGothicOne,
    fontSize: "1.2rem",
    color: "white",
    opacity: 0.9,
    lineHeight: "1.5",
  },
  imageContainer: {
    marginTop: "50px",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  chatImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  antropometricImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  capabilitiesTitle: {
    ...fonts.delaGothicOne,
    fontSize: "2.5rem",
    fontWeight: "400",
    color: "white",
    textAlign: "center",
    marginTop: "8rem",
    marginBottom: "2rem",
  },
  divider: {
    width: "100%",
    maxWidth: "1200px",
    height: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: "80px",
  },
  categoryImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    background:'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(9px)',
    padding: "20px",
  },
  imageStyle: {
    borderRadius: "16px",
    width: "100%",
    height: "auto",
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
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          ФИТНЕС ДОЛЖЕН БЫТЬ ДОСТУПЕН КАЖДОМУ
        </Typography>
        {!user && (
          <Button
            variant="contained"
            onClick={() => handleNavigate('/signup')}
            sx={styles.button}
          >
            Создать профиль
          </Button>
        )}
        <Typography sx={styles.capabilitiesTitle}>
          Наши возможности
        </Typography>
        <Box sx={styles.divider} />
      </Box>

      <Box sx={styles.content}>
        <Box sx={styles.textContent}>
          <Typography sx={styles.subtitle}>
            Календарь тренировок
          </Typography>
          <Typography sx={styles.description}>
            Создать календарь тренировок под свои цели.
            Планируй занятия, ставь напоминания 
            и следи за графиком.
          </Typography>
        </Box>
        <Box sx={styles.imageContainer}>
          <img 
            src={calendar} 
            alt="Календарь тренировок" 
            style={styles.calendarImage}
          />
        </Box>
      </Box>

      <Box sx={{...styles.content, flexDirection: 'row-reverse'}}>
        <Box sx={styles.textContent}>
          <Typography sx={styles.subtitle}>
            Чат с тренером
          </Typography>
          <Typography sx={styles.description}>
            Работать с персональным тренером онлайн.
            Получай обратную связь, корректировки и 
            мотивацию.
          </Typography>
        </Box>
        <Box sx={styles.imageContainer}>
          <img 
            src={chat} 
            alt="Чат с тренером" 
            style={styles.chatImage}
          />
        </Box>
      </Box>

      <Box sx={styles.content}>
        <Box sx={styles.textContent}>
          <Typography sx={styles.subtitle}>
            Замеры прогресса
          </Typography>
          <Typography sx={styles.description}>
            Отслеживать прогресс с помощью замеров.
            Фиксируй вес, объёмы и другие параметры
          </Typography>
        </Box>
        <Box sx={styles.imageContainer}>
          <img 
            src={antropometric} 
            alt="Замеры прогресса" 
            style={styles.antropometricImage}
          />
        </Box>
      </Box>

      <Box sx={{...styles.content, flexDirection: 'row-reverse'}}>
        <Box sx={styles.textContent}>
          <Typography sx={styles.subtitle}>
          Фитнес-советы 
          </Typography>
          <Typography sx={styles.description}>
          Получай отборные фитнес-советы и добавляй в избранное то, что хочешь внедрить в свою тренировку
          </Typography>
        </Box>
        <Box sx={styles.imageContainer}>
          <img 
            src={advice} 
            alt="Чат с тренером" 
            style={styles.chatImage}
          />
        </Box>
      </Box>

    </Box>
  );
}
