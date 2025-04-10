import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, Button } from '@mui/material';
import { IUserProfile } from '@/entities/user/model';
import { getUserColor } from '@/shared/utils/userColor';
import { useUser } from '@/entities/user/hooks/useUser';
import { useNavigate } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface TranerCardProps {
  char: IUserProfile;
}

const styles = {
  card: {
    width: "100%",
    padding: "24px",
    borderRadius: "24px",
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    transition: "all 0.3s ease",
    backdropFilter: "blur(9px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    border: "2px solid rgba(161, 161, 161, 0.93)",
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    position: "relative",
    overflow: "hidden",
  },
  avatar: {
    width: 120,
    height: 120,
    border: "4px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "150px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  info: {
    color: "rgba(0, 0, 0, 0.9)",
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.9)",
    marginBottom: "8px",
  },
  email: {
    fontSize: "1rem",
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: "12px",
  },
  details: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginBottom: "16px",
  },
  detail: {
    fontSize: "1rem",
    color: "rgba(0, 0, 0, 0.7)",
  },
  about: {
    fontSize: "1rem",
    color: "rgba(0, 0, 0, 0.9)",
    marginTop: "12px",
    padding: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "16px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    maxWidth: "100%",
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.6,
    letterSpacing: "0.3px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  readMoreButton: {
    marginTop: "12px",
    color: "rgba(0, 0, 0, 0.7)",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
  chatButton: {
    marginTop: "16px",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    color: "white",
    py: 1.5,
    px: 3,
    fontSize: "1.1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
    },
  },
  buttonsContainer: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
};

export default function TranerCard({ char }: TranerCardProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const MAX_CHARS = 100;
  const { user } = useUser();
  const isTrainer = user?.trener || false;
  const navigate = useNavigate();

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

  const getYearsText = (years: number): string => {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'лет';
    }
    if (lastDigit === 1) {
      return 'год';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'года';
    }
    return 'лет';
  };

  const getAvatarUrl = (): string => {
    if (char.UserProfile?.avatar) {
      const baseUrl = import.meta.env.VITE_API.replace('/api', '');
      return `${baseUrl}${char.UserProfile.avatar}`;
    }
    return "";
  };

  const getUserAvatarColor = (): string => {
    return getUserColor(char.email);
  };

  const toggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleChatClick = (): void => {
    navigate('/profile', { 
      state: { 
        scrollToChat: true,
        trainerId: char.id,
        openChatWithTrainer: true // Добавляем флаг для открытия чата с конкретным тренером
      } 
    });
  };

  const renderAboutText = (): React.JSX.Element | null => {
    if (!char.UserProfile?.about) return null;

    const aboutText = char.UserProfile.about;
    const shouldTruncate = aboutText.length > MAX_CHARS && !isExpanded;
    const displayText = shouldTruncate 
      ? `${aboutText.substring(0, MAX_CHARS)}...` 
      : aboutText;

    return (
      <>
        <Typography sx={styles.about}>
          {displayText}
        </Typography>
        {aboutText.length > MAX_CHARS && (
          <Button 
            onClick={toggleExpand} 
            sx={styles.readMoreButton}
          >
            {isExpanded ? 'Свернуть' : 'Прочитать' }
          </Button>
        )}
      </>
    );
  };

  return (
    <Paper sx={styles.card}>
      <div className="left-glow" />
      <div className="right-glow" />
      <Avatar
        src={getAvatarUrl()}
        alt={char.name}
        sx={{
          ...styles.avatar,
          bgcolor: getUserAvatarColor(),
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "40px", fontWeight: "bold" }}>
          {char.name?.[0] || "U"}
        </Typography>
      </Avatar>
      
      <Box sx={styles.info}>
        <Typography sx={styles.name}>{char.name}</Typography>
        <Typography sx={styles.email}>{char.email}</Typography>
        
        <Box sx={styles.details}>
          <Typography sx={styles.detail}>
            Пол: {char.UserProfile ? getGenderText(char.UserProfile.gender) : 'Не указан'}
          </Typography>
          <Typography sx={styles.detail}>
            {isTrainer ? 'Стаж тренировок' : 'Стаж работы'}: {char.UserProfile ? `${char.UserProfile.trainingExperience} ${getYearsText(char.UserProfile.trainingExperience)}` : 'Не указан'}
          </Typography>
        </Box>

        {renderAboutText()}

        {!isTrainer && ( // Условие для отображения кнопки только если пользователь не тренер
          <Box sx={styles.buttonsContainer}>
            <Button
              variant="contained"
              onClick={handleChatClick}
              sx={styles.chatButton}
            >
              Написать тренеру
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
}