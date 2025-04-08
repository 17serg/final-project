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
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "rgba(128, 128, 128, 0.7)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.4)",
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  avatar: {
    width: 100,
    height: 100,
    border: "4px solid rgba(128, 128, 128, 0.7)",
  },
  info: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "4px",
  },
  email: {
    fontSize: "1rem",
    color: "gray",
    marginBottom: "8px",
  },
  details: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    marginBottom: "12px",
  },
  detail: {
    fontSize: "1rem",
    color: "black",
  },
  about: {
    fontSize: "1rem",
    color: "black",
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    maxWidth: "100%",
    fontFamily: "'Roboto', sans-serif",
    lineHeight: 1.6,
    letterSpacing: "0.3px",
  },
  readMoreButton: {
    marginTop: "8px",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgb(22, 22, 24)",
    },
  },
  chatButton: {
    marginTop: "12px",
    backgroundColor: "rgb(42, 41, 223)",
    color: "white",
    "&:hover": {
      backgroundColor: "rgb(32, 31, 213)",
    },
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
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
            {isExpanded ? 'Свернуть' : 'Прочитать'}
          </Button>
        )}
      </>
    );
  };

  return (
    <Paper sx={styles.card}>
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
            {isTrainer ? 'Стаж тренировок' : 'Стаж работы'}: {char.UserProfile ? `${char.UserProfile.trainingExperience} лет` : 'Не указан'}
          </Typography>
        </Box>

        {renderAboutText()}

        <Box sx={styles.buttonsContainer}>
          <Button
            variant="contained"
            onClick={handleChatClick}
            sx={styles.chatButton}
          >
            {isTrainer ? 'Написать тренеру' : 'Написать посетителю'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}