import { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Stack, Paper, useTheme, Button } from '@mui/material';
import { getFromStorage, setToStorage } from '../../helpers/storage';
import { ChatMessage } from '../../types/chat';
import { User } from '../../types/user';
import { v4 as uuidv4 } from 'uuid';

const CHAT_KEY = 'chat_messages';
const USER_KEY = 'registration_request';

const STICKERS = [
  '/stickers/sticker1.svg',
  '/stickers/sticker2.svg',
  '/stickers/sticker3.svg',
  '/stickers/sticker4.svg',
];

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(getFromStorage<ChatMessage[]>(CHAT_KEY, []));
  const [input, setInput] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const user: User | null = getFromStorage<User | null>(USER_KEY, null);
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !selectedSticker) return;
    const msg: ChatMessage = {
      id: uuidv4(),
      userId: user?.id || '',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Гость',
      content: input,
      timestamp: Date.now(),
      stickerUrl: selectedSticker || undefined,
    };
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    setToStorage(CHAT_KEY, newMessages);
    setInput('');
    setSelectedSticker(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <Typography variant="h5" gutterBottom>Чат с преподавателем</Typography>
      <Paper sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? '#111' : 'background.paper' }}>
        <Stack spacing={2}>
          {messages.map(msg => (
            <Box key={msg.id} sx={{
              alignSelf: msg.userId === user?.id ? 'flex-end' : 'flex-start',
              bgcolor: theme.palette.mode === 'dark' ? (msg.userId === user?.id ? '#333' : '#222') : (msg.userId === user?.id ? '#e6c9d6' : '#b2c9d6'),
              color: theme.palette.mode === 'dark' ? '#fff' : '#2d2d2d',
              borderRadius: 2,
              p: 1.5,
              maxWidth: '80%',
              boxShadow: theme.palette.mode === 'dark' ? '0 0 8px #444' : 'none',
            }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{msg.userName}</Typography>
              {msg.stickerUrl && <img src={msg.stickerUrl} alt="sticker" style={{ height: 48, margin: '4px 0' }} />}
              {msg.content && <Typography>{msg.content}</Typography>}
              <Typography variant="caption" sx={{ opacity: 0.6 }}>{new Date(msg.timestamp).toLocaleTimeString()}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          fullWidth
          size="small"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} sx={{ bgcolor: '#b2c9d6', color: '#2d2d2d', '&:hover': { bgcolor: '#a0b8c6' } }}>Отправить</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {STICKERS.map(url => (
          <IconButton key={url} onClick={() => setSelectedSticker(url)} sx={{ border: selectedSticker === url ? '2px solid #b2c9d6' : 'none', bgcolor: 'background.paper' }}>
            <img src={url} alt="sticker" style={{ height: 32 }} />
          </IconButton>
        ))}
      </Stack>
    </Box>
  );
};

export default Chat; 