import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
); 