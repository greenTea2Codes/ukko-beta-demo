import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import ChatView from './views/ChatView'

function App() {
  // Detect if the user prefers dark mode (e.g., Ubuntu dark mode)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Create theme based on preference
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatView />
    </ThemeProvider>
  );
};

export default App;
