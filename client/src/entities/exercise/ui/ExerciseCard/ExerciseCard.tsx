import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Exercise } from '@/entities/exercise/api/ExerciseApi';

interface ExerciseCardProps {
  exercise: Exercise;
}

const styles = {
  card: {
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
    // transition: "all 0.3s ease",
    backdropFilter: "blur(9px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.4)",
    maxWidth: 300,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    transition: 'transform 0.2s',
    cursor: 'pointer',

    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  mediaContainer: {
    position: 'relative',
    paddingTop: '56.25%', // Соотношение сторон 16:9
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#f5f5f5',
  },
  content: {
    color: 'white',
    flexGrow: 1,
  },
  category: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    zIndex: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    outline: 'none',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalImageContainer: {
    maxHeight: '50vh',
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    maxHeight: '50vh',
    objectFit: 'contain',
    display: 'block',
  },
  modalInfo: {
    padding: '24px',
    overflowY: 'auto',
    maxHeight: '40vh',
  },
  modalTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  modalCategory: {
    fontSize: '1.4rem',
    color: 'primary.main',
    marginBottom: '16px',
  },
  modalDescription: {
    fontSize: '1.2rem',
    marginBottom: '24px',
  },
  modalDetail: {
    fontSize: '1.1rem',
    marginBottom: '8px',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
  },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getImageUrl = (imagePath: string): string => {
    const baseUrl = import.meta.env.VITE_API.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const getDifficultyText = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'Начальный уровень';
      case 'intermediate':
        return 'Средний уровень';
      case 'advanced':
        return 'Продвинутый уровень';
      default:
        return difficulty;
    }
  };

  const getEquipmentText = (equipment: string | null): string => {
    if (!equipment || equipment.toLowerCase() === 'none' || equipment.toLowerCase() === 'нет') {
      return 'Не требуется';
    }
    return equipment;
  };

  return (
    <>
      <Card sx={styles.card}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={styles.media}
          image={exercise.image}
          alt={exercise.name}
        />
        <Typography variant="body2" sx={styles.category}>
          {exercise.category}
        </Typography>
      </Box>
      <CardContent sx={styles.content}>
        <Typography gutterBottom variant="h6" component="div">
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="rgba(230, 230, 230, 0.62)">
          {exercise.description}
        </Typography>
      </CardContent>
    </Card>

      <Modal open={modalOpen} onClose={handleCloseModal} sx={styles.modal}>
        <Box sx={styles.modalContent}>
          <IconButton onClick={handleCloseModal} sx={styles.closeButton} size="small">
            <CloseIcon />
          </IconButton>
          <Box sx={styles.modalImageContainer}>
            <img src={getImageUrl(exercise.image)} alt={exercise.name} style={styles.modalImage} />
          </Box>
          <Box sx={styles.modalInfo}>
            <Typography variant="h5" sx={styles.modalTitle}>
              {exercise.name}
            </Typography>
            <Typography variant="subtitle1" sx={styles.modalCategory}>
              {exercise.category}
            </Typography>
            <Typography variant="body1" sx={styles.modalDescription}>
              {exercise.description}
            </Typography>
            <Typography variant="body2" sx={styles.modalDetail}>
              Сложность: {getDifficultyText(exercise.difficulty)}
            </Typography>
            {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
              <Typography variant="body2" sx={styles.modalDetail}>
                Мышечные группы: {exercise.muscle_groups.join(', ')}
              </Typography>
            )}
            <Typography variant="body2" sx={styles.modalDetail}>
              Оборудование: {getEquipmentText(exercise.equipment)}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>

  );
};
