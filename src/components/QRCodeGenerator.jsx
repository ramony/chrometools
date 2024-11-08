import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Slider,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState('L');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const qrRef = useRef();

  const downloadQRCode = () => {
    if (!text) {
      setSnackbarMessage('请先输入内容');
      setSnackbarOpen(true);
      return;
    }
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const copyQRCode = async () => {
    if (!text) {
      setSnackbarMessage('请先输入内容');
      setSnackbarOpen(true);
      return;
    }
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setSnackbarMessage('已复制到剪贴板');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('复制失败:', err);
        setSnackbarMessage('复制失败');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="文本内容"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入文本或URL"
            multiline
            rows={4}
          />

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>纠错级别</InputLabel>
              <Select
                value={level}
                label="纠错级别"
                onChange={(e) => setLevel(e.target.value)}
                size="small"
              >
                <MenuItem value="L">低 (7%)</MenuItem>
                <MenuItem value="M">中 (15%)</MenuItem>
                <MenuItem value="Q">较高 (25%)</MenuItem>
                <MenuItem value="H">高 (30%)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="color"
              label="前景色"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              size="small"
              sx={{ width: 100 }}
            />

            <TextField
              type="color"
              label="背景色"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              size="small"
              sx={{ width: 100 }}
            />
          </Stack>

          <Box>
            <Typography gutterBottom>二维码尺寸: {size}px</Typography>
            <Slider
              value={size}
              onChange={(_, newValue) => setSize(newValue)}
              min={128}
              max={512}
              step={8}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 3,
            backgroundColor: '#f5f5f5',
            borderRadius: 1
          }}>
            <Box ref={qrRef} sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
              <QRCodeCanvas
                value={text || ' '}
                size={size}
                level={level}
                fgColor={fgColor}
                bgColor={bgColor}
                includeMargin
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadQRCode}
              disabled={!text}
            >
              下载二维码
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={copyQRCode}
              disabled={!text}
            >
              复制二维码
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default QRCodeGenerator; 