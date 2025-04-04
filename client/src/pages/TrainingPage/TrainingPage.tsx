import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';

export const TrainingPage = (): React.ReactElement => {
  const { trainingId } = useParams();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создание тренировочного плана
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          ID тренировки: {trainingId}
        </Typography>
        {/* Здесь будет форма создания тренировочного плана */}
      </Box>
    </Container>
  );
};
