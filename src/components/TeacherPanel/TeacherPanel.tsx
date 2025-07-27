import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, TextField, Alert } from '@mui/material';
import { getFromStorage, setToStorage } from '../../helpers/storage';
import { User } from '../../types/user';

const REGISTRATION_KEY = 'registration_request';
const APPROVED_USERS_KEY = 'approved_users';

const TeacherPanel = () => {
  const [pending, setPending] = useState<User | null>(null);
  const [approved, setApproved] = useState<User[]>([]);
  const [rejectionComment, setRejectionComment] = useState('');
  const [action, setAction] = useState<'none' | 'approved' | 'rejected'>('none');

  useEffect(() => {
    setPending(getFromStorage<User | null>(REGISTRATION_KEY, null));
    setApproved(getFromStorage<User[]>(APPROVED_USERS_KEY, []));
  }, [action]);

  const handleApprove = () => {
    if (!pending) return;
    const updatedUser = { ...pending, isApproved: true };
    setToStorage(APPROVED_USERS_KEY, [...approved, updatedUser]);
    setToStorage(REGISTRATION_KEY, null);
    setAction('approved');
  };

  const handleReject = () => {
    if (!pending) return;
    const updatedUser = { ...pending, isApproved: false, isRejected: true, rejectionComment };
    setToStorage(REGISTRATION_KEY, updatedUser);
    setAction('rejected');
  };

  if (action === 'approved') {
    return <Alert severity="success">Заявка одобрена! Пользователь получит логин и пароль.</Alert>;
  }
  if (action === 'rejected') {
    return <Alert severity="error">Заявка отклонена. Пользователь получит комментарий.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Панель преподавателя</Typography>
      {pending ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Фамилия: {pending.lastName}</Typography>
            <Typography>Имя: {pending.firstName}</Typography>
            <Typography>Категория: {pending.category}</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              sx={{ bgcolor: '#b2c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#a0b8c6' } }}
              onClick={handleApprove}
            >
              Одобрить
            </Button>
            <TextField
              size="small"
              label="Комментарий к отклонению"
              value={rejectionComment}
              onChange={e => setRejectionComment(e.target.value)}
              sx={{ mx: 1 }}
            />
            <Button
              variant="contained"
              sx={{ bgcolor: '#e6c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#d6b8c6' } }}
              onClick={handleReject}
            >
              Отклонить
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Alert severity="info">Нет новых заявок на регистрацию.</Alert>
      )}
    </Box>
  );
};

export default TeacherPanel; 