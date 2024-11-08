import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Stop as StopIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';
import { globalStyles } from '../../styles';

const BatchProcessor = ({ selectedEffect, effectParams, onProcessComplete }) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          // 应用特效
          if (selectedEffect) {
            ctx.filter = `
              ${selectedEffect.type === 'grayscale' ? `grayscale(${effectParams.intensity}%)` : ''}
              ${selectedEffect.type === 'sepia' ? `sepia(${effectParams.intensity}%)` : ''}
              ${selectedEffect.type === 'blur' ? `blur(${effectParams.intensity / 20}px)` : ''}
              ${selectedEffect.type === 'brightness' ? `brightness(${effectParams.intensity}%)` : ''}
              ${selectedEffect.type === 'contrast' ? `contrast(${effectParams.intensity}%)` : ''}
              ${selectedEffect.type === 'saturate' ? `saturate(${effectParams.intensity}%)` : ''}
            `.trim();
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            resolve({
              name: file.name,
              blob: blob
            });
          }, 'image/png');
        };
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const startProcessing = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    setError(null);
    abortController.current = new AbortController();

    try {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        if (abortController.current.signal.aborted) {
          break;
        }

        try {
          const result = await processImage(files[i]);
          results.push(result);
          setProcessedCount(i + 1);
          setProgress(((i + 1) / files.length) * 100);
        } catch (err) {
          console.error(`处理文件 ${files[i].name} 时出错:`, err);
        }
      }

      if (results.length > 0) {
        onProcessComplete(results);
      }
    } catch (err) {
      setError('批量处理过程中出现错误');
    } finally {
      setProcessing(false);
    }
  };

  const stopProcessing = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  return (
    <Box sx={globalStyles.imageEffects.batchArea}>
      <Stack spacing={2}>
        <Typography variant="h6">批量处理</Typography>

        {/* 文件上传区域 */}
        <Box sx={globalStyles.imageEffects.uploadZone}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            id="batch-file-input"
            onChange={handleFileSelect}
            disabled={processing}
          />
          <label htmlFor="batch-file-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              disabled={processing}
            >
              选择图片
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            支持多选，可拖拽添加
          </Typography>
        </Box>

        {/* 文件列表 */}
        {files.length > 0 && (
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {files.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(1)} KB`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveFile(index)}
                      disabled={processing}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* 进度显示 */}
        {processing && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={globalStyles.progress}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {processedCount}/{files.length}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<StopIcon />}
              onClick={stopProcessing}
            >
              停止处理
            </Button>
          </Box>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 操作按钮 */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<StartIcon />}
            onClick={startProcessing}
            disabled={files.length === 0 || processing}
          >
            开始处理
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFiles([])}
            disabled={processing}
          >
            清空列表
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BatchProcessor; 