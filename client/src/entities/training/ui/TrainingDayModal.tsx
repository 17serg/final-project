import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

interface TrainingDayModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
}

const TrainingDayModal = ({ open, onClose, date }: TrainingDayModalProps) => {
  const navigate = useNavigate();

  const handleGoToTraining = () => {
    // TODO: Добавить навигацию к плану тренировки
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="training-day-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Тренировочный день
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        <Button variant="contained" fullWidth onClick={handleGoToTraining} sx={{ mt: 2 }}>
          К плану тренировки
        </Button>
      </Box>
    </Modal>
  );
};

export default TrainingDayModal;
