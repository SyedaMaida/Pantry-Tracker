import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#d32f2f', // Red
    },
    background: {
      default: '#ffffff', // Bright White
      paper: '#ffeb3b', // Bright Yellow
    },
    text: {
      primary: '#333333', // Dark Grey
      secondary: '#555555', // Medium Grey
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
        outlinedSecondary: {
          borderColor: '#d32f2f',
          color: '#d32f2f',
          '&:hover': {
            borderColor: '#b71c1c',
            color: '#b71c1c',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          color: '#333333',
        },
        h4: {
          color: '#1976d2', // Changed to match the primary color
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffeb3b', // Bright Yellow
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
