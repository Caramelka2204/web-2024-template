import { useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Chip, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFromStorage, setToStorage } from '../../helpers/storage';
import { ScheduleItem, ScheduleType } from '../../types/schedule';
import { User } from '../../types/user';
import ScheduleEditDialog from './ScheduleEditDialog';

const SCHEDULE_KEY = 'schedule_items';
const USER_KEY = 'registration_request';

const TABS: { label: string; value: ScheduleType | 'all' }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Лекции', value: 'lecture' },
  { label: 'Клубы', value: 'club' },
  { label: 'Мероприятия', value: 'event' },
];

const Schedule = () => {
  const [tab, setTab] = useState<ScheduleType | 'all'>('all');
  const [schedule, setSchedule] = useState<ScheduleItem[]>(getFromStorage<ScheduleItem[]>(SCHEDULE_KEY, []));
  const user: User | null = getFromStorage<User | null>(USER_KEY, null);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Фильтрация по типу и доступности лекций
  const filtered = useMemo(() => {
    return schedule.filter(item => {
      if (tab !== 'all' && item.type !== tab) return false;
      if (item.type === 'lecture' && item.groupVisibility && user?.category && user.role !== 'teacher') {
        return item.groupVisibility.includes(user.category);
      }
      return true;
    });
  }, [schedule, tab, user]);

  const isTeacher = user?.role === 'teacher';

  const handleSave = (item: ScheduleItem) => {
    setSchedule(prev => {
      const exists = prev.find(i => i.id === item.id);
      const updated = exists ? prev.map(i => (i.id === item.id ? item : i)) : [...prev, item];
      setToStorage(SCHEDULE_KEY, updated);
      return updated;
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setSchedule(prev => {
      const updated = prev.filter(i => i.id !== deleteId);
      setToStorage(SCHEDULE_KEY, updated);
      return updated;
    });
    setDeleteId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Расписание</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {TABS.map(t => <Tab key={t.value} label={t.label} value={t.value} />)}
      </Tabs>
      {isTeacher && (
        <Button variant="contained" sx={{ mb: 2, bgcolor: '#b2c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#a0b8c6' } }} onClick={() => { setEditItem(undefined); setEditOpen(true); }}>
          Добавить событие
        </Button>
      )}
      <Stack spacing={2}>
        {filtered.length === 0 && <Typography>Нет событий</Typography>}
        {filtered.map(item => (
          <Card key={item.id} sx={{ bgcolor: 'background.paper', position: 'relative' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Chip label={item.type === 'lecture' ? 'Лекция' : item.type === 'club' ? 'Клуб' : 'Мероприятие'} />
                <Typography variant="h6">{item.title}</Typography>
                {isTeacher && (
                  <>
                    <IconButton onClick={() => { setEditItem(item); setEditOpen(true); }} size="small" sx={{ ml: 1, color: '#b2c9d6' }}><EditIcon /></IconButton>
                    <IconButton onClick={() => setDeleteId(item.id)} size="small" sx={{ color: '#e6c9d6' }}><DeleteIcon /></IconButton>
                  </>
                )}
              </Stack>
              <Typography>Время: {item.time}</Typography>
              <Typography>Место: {item.place}</Typography>
              <Typography>Продолжительность: {item.duration}</Typography>
              <Typography>Преподаватель: {item.teacher}</Typography>
              <Typography>Записано: {item.participants.length} / {item.maxParticipants}</Typography>
              {item.type === 'lecture' && item.assignment && (
                <Typography sx={{ mt: 1 }}>Задание: {item.assignment}</Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
      <ScheduleEditDialog open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} initial={editItem} />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Удалить событие?</DialogTitle>
        <DialogContent>Вы уверены, что хотите удалить это событие?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} sx={{ bgcolor: '#e6c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#d6b8c6' } }}>Отмена</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#b2c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#a0b8c6' } }}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule; 