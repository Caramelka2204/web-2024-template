import { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper, MenuItem, Alert } from '@mui/material';
import { getFromStorage, setToStorage } from '../../helpers/storage';
import { CATEGORIES } from '../../constants/categories';
import { User } from '../../types/user';

const USER_KEY = 'registration_request';

const Profile = () => {
  const [user, setUser] = useState<User | null>(getFromStorage<User | null>(USER_KEY, null));
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [category, setCategory] = useState(user?.category || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, firstName, lastName, category, photoUrl };
    setUser(updated);
    setToStorage(USER_KEY, updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (!user) return <Alert severity="info">Профиль не найден</Alert>;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Профиль</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar src={photoUrl} sx={{ width: 80, height: 80, mb: 1 }} />
          <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ mb: 2 }}>
            Загрузить фото
          </Button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoChange} />
        </Box>
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
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
          Сохранить
        </Button>
        {success && <Alert severity="success" sx={{ mt: 2 }}>Профиль обновлён</Alert>}
      </Paper>
    </Box>
  );
};

export default Profile; 