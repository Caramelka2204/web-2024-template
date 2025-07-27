import { useState, useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import { getFromStorage, setToStorage } from '../../helpers/storage';

const THEME_KEY = 'theme_mode';

const Settings = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(getFromStorage(THEME_KEY, 'light'));

  useEffect(() => {
    setToStorage(THEME_KEY, mode);
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Настройки</Typography>
        <Typography sx={{ mb: 2 }}>Тема оформления</Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          fullWidth
        >
          <ToggleButton value="light">Светлая</ToggleButton>
          <ToggleButton value="dark">Тёмная</ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </Box>
  );
};

export default Settings; 