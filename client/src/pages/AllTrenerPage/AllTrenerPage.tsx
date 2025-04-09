import React, { useEffect, useState } from 'react'
import { UserApi } from '@/entities/user/api/UserApi'
import { IUserProfile } from './../../entities/user/model'
import TranerCard from '@/widgets/TranerCard/TranerCard'
import { Box, Typography } from '@mui/material'

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "white",
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    marginBottom: "25px",
  },
};

export function AllTrenerPage(): React.JSX.Element {
  const [alltrener, setTraner] = useState<IUserProfile[]>([])
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    const fetchTraners = async (): Promise<void> => {
      try {
        const response = await UserApi.getAllTrenerProfile();
        setTraner(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTraners();
  }, [refreshKey]);

  // Функция для обновления списка тренеров
  const refreshTrainers = (): void => {
    setRefreshKey(prev => prev + 1);
  };

  // Добавляем обработчик события для обновления данных
  useEffect(() => {
    // Слушаем событие обновления профиля
    const handleProfileUpdate = (): void => {
      refreshTrainers();
    };

    // Добавляем слушатель события
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        Наши тренеры
      </Typography>
      <Box sx={styles.cardsContainer}>
        {alltrener.map((el) => (
          <TranerCard key={el.userId} char={el} />
        ))}
      </Box>
    </Box>
  )
}


