import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import TeacherPanel from './components/TeacherPanel';
import Schedule from './components/Schedule/Schedule';
import Chat from './components/Chat/Chat';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';

const PASTEL_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#b2c9d6' },
    secondary: { main: '#e6c9d6' },
    background: { default: '#f7f7fa', paper: '#f0f4f8' },
    text: { primary: '#2d2d2d', secondary: '#6d6d6d' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#e6c9d6',
          color: '#2d2d2d',
          '&:hover': { backgroundColor: '#b2c9d6' },
        },
      },
    },
  },
});

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <ThemeProvider theme={PASTEL_THEME}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}>
            <IconButton onClick={handleMenu} size="large">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose} component="a" href="/registration">Регистрация</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/schedule">Расписание</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/chat">Чат</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/profile">Профиль</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/teacher">Панель преподавателя</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/settings">Настройки</MenuItem>
            </Menu>
          </Box>
          <Box sx={{ flex: 1, p: 2 }}>
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/teacher" element={<TeacherPanel />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/registration" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
