import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CATEGORIES } from '../../constants/categories';
import { setToStorage, getFromStorage } from '../../helpers/storage';
import { User } from '../../types/user';
import { v4 as uuidv4 } from 'uuid';

const REGISTRATION_KEY = 'registration_request';

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isRegistered = !!getFromStorage<User | null>(REGISTRATION_KEY, null);

  const handleSubmit = () => {
    if (!firstName || !lastName || !category || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    const user: User = {
      id: uuidv4(),
      login: '',
      password,
      role: 'group',
      group: category,
      firstName,
      lastName,
      category,
      isApproved: false,
    };
    setToStorage(REGISTRATION_KEY, user);
    setSubmitted(true);
  };

  if (isRegistered) {
    return <Alert severity="info">Вы уже отправили заявку. Ожидайте одобрения преподавателя.</Alert>;
  }

  if (submitted) {
    return <Alert severity="success">Заявка отправлена! Ожидайте одобрения преподавателя.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      <TextField
        label="Фамилия"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Имя"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Категория"
        value={category}
        onChange={e => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      >
        {CATEGORIES.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Пароль"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Отправить заявку
      </Button>
    </Box>
  );
};

export default Registration; 