import { Box, Container, Typography } from '@mui/material';
import { Calendar } from '@/entities/day/ui/Calendar';

export const CalendarPage = (): React.ReactElement => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Календарь тренировок
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Выберите день для добавления или отмены тренировки
        </Typography>
        <Calendar />
      </Box>
    </Container>
  );
};
