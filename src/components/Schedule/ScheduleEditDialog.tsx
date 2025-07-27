import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import { ScheduleItem, ScheduleType } from '../../types/schedule';
import { CATEGORIES } from '../../constants/categories';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (item: ScheduleItem) => void;
  initial?: ScheduleItem;
}

const SCHEDULE_TYPES: { value: ScheduleType; label: string }[] = [
  { value: 'lecture', label: 'Лекция' },
  { value: 'club', label: 'Клуб' },
  { value: 'event', label: 'Мероприятие' },
];

const ScheduleEditDialog = ({ open, onClose, onSave, initial }: Props) => {
  const [type, setType] = useState<ScheduleType>(initial?.type || 'lecture');
  const [title, setTitle] = useState(initial?.title || '');
  const [time, setTime] = useState(initial?.time || '');
  const [place, setPlace] = useState(initial?.place || '');
  const [duration, setDuration] = useState(initial?.duration || '');
  const [teacher, setTeacher] = useState(initial?.teacher || '');
  const [maxParticipants, setMaxParticipants] = useState(initial?.maxParticipants || 10);
  const [groupVisibility, setGroupVisibility] = useState<string[]>(initial?.groupVisibility || []);
  const [assignment, setAssignment] = useState(initial?.assignment || '');

  const handleSave = () => {
    onSave({
      id: initial?.id || Date.now().toString(),
      type,
      title,
      time,
      place,
      duration,
      teacher,
      maxParticipants,
      participants: initial?.participants || [],
      groupVisibility: type === 'lecture' ? groupVisibility : undefined,
      assignment: type === 'lecture' ? assignment : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Редактировать событие' : 'Создать событие'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Тип</InputLabel>
          <Select value={type} onChange={e => setType(e.target.value as ScheduleType)} input={<OutlinedInput label="Тип" />}>
            {SCHEDULE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Название" value={title} onChange={e => setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField label="Время" value={time} onChange={e => setTime(e.target.value)} fullWidth margin="normal" />
        <TextField label="Место" value={place} onChange={e => setPlace(e.target.value)} fullWidth margin="normal" />
        <TextField label="Продолжительность" value={duration} onChange={e => setDuration(e.target.value)} fullWidth margin="normal" />
        <TextField label="Преподаватель" value={teacher} onChange={e => setTeacher(e.target.value)} fullWidth margin="normal" />
        <TextField label="Максимум участников" type="number" value={maxParticipants} onChange={e => setMaxParticipants(Number(e.target.value))} fullWidth margin="normal" />
        {type === 'lecture' && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Видимость для групп</InputLabel>
              <Select
                multiple
                value={groupVisibility}
                onChange={e => setGroupVisibility(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Видимость для групп" />}
                renderValue={selected => (selected as string[]).join(', ')}
              >
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    <Checkbox checked={groupVisibility.indexOf(cat) > -1} />
                    <ListItemText primary={cat} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Задание" value={assignment} onChange={e => setAssignment(e.target.value)} fullWidth margin="normal" />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ bgcolor: '#e6c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#d6b8c6' } }}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#b2c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#a0b8c6' } }}>{initial ? 'Сохранить' : 'Создать'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleEditDialog; 