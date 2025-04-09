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
  },
};

export function AllClientsPage(): React.JSX.Element {
  const [allClients, setClients] = useState<IUserProfile[]>([])
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    const fetchClients = async (): Promise<void> => {
      try {
        const response = await UserApi.getAllClientsProfile();
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, [refreshKey]);

  // Функция для обновления списка клиентов
  const refreshClients = (): void => {
    setRefreshKey(prev => prev + 1);
  };

  // Добавляем обработчик события для обновления данных
  useEffect(() => {
    // Слушаем событие обновления профиля
    const handleProfileUpdate = (): void => {
      refreshClients();
    };

    // Добавляем слушатель события
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Удаляем слушатель при размонтировании компонента
    return (): void => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        Наши клиенты
      </Typography>
      <Box sx={styles.cardsContainer}>
        {allClients.map((el) => (
          <TranerCard key={el.userId} char={el} />
        ))}
      </Box>
    </Box>
  )
} 