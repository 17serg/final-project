import { createTheme } from '@mui/material/styles';

export const fonts = {
  delaGothicOne: {
    fontFamily: '"Dela Gothic One", sans-serif',
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: '0.02em',
  },
  montserrat: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
  },
};

// Создаем тему с настройками шрифтов
export const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", Dela Gothic One',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Montserrat:wght@400;500;600;700&display=swap');
        
        @font-face {
          font-family: 'Dela Gothic One';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/delagothicone/v15/hESp6XxvmdRAQq6iYDE-aUoM8n4oV0.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
      `,
    },
  },
}); 