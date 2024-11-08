import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Fade,
  Divider
} from '@mui/material';
import {
  RestartAlt as ResetIcon,
  Compare as CompareIcon,
  Save as SaveIcon,
  Tune as TuneIcon
} from '@mui/icons-material';

// 基础特效定义
const BASIC_EFFECTS = {
  normal: {
    label: '原图',
    description: '恢复原始图片效果'
  },
  grayscale: {
    label: '黑白',
    description: '将图片转换为黑白效果'
  },
  sepia: {
    label: '复古',
    description: '添加温暖的复古色调'
  },
  blur: {
    label: '模糊',
    description: '柔化图片细节'
  },
  brightness: {
    label: '亮度',
    description: '调整图片整体明暗度'
  },
  contrast: {
    label: '对比度',
    description: '增强或减弱明暗对比'
  },
  saturate: {
    label: '饱和度',
    description: '调整色彩的鲜艳程度'
  }
};

const ImageEffects = ({ imageUrl, onSave, showComparison }) => {
  const [selectedEffect, setSelectedEffect] = useState('normal');
  const [intensity, setIntensity] = useState(100);
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (imageUrl) {
      applyEffect();
    }
  }, [imageUrl, selectedEffect, intensity]);

  const applyEffect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 应用特效
      switch (selectedEffect) {
        case 'grayscale':
          ctx.filter = `grayscale(${intensity}%)`;
          break;
        case 'sepia':
          ctx.filter = `sepia(${intensity}%)`;
          break;
        case 'blur':
          ctx.filter = `blur(${intensity / 20}px)`;
          break;
        case 'brightness':
          ctx.filter = `brightness(${intensity}%)`;
          break;
        case 'contrast':
          ctx.filter = `contrast(${intensity}%)`;
          break;
        case 'saturate':
          ctx.filter = `saturate(${intensity}%)`;
          break;
        default:
          ctx.filter = 'none';
      }

      ctx.drawImage(img, 0, 0);
      setPreviewUrl(canvas.toDataURL());
    };

    img.src = imageUrl;
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>选择特效</InputLabel>
          <Select
            value={selectedEffect}
            onChange={(e) => setSelectedEffect(e.target.value)}
            label="选择特效"
          >
            {Object.entries(BASIC_EFFECTS).map(([key, { label, description }]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ py: 1 }}>
                  <Typography variant="body1">{label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="重置">
          <IconButton
            onClick={() => {
              setSelectedEffect('normal');
              setIntensity(100);
            }}
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {selectedEffect !== 'normal' && (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2">特效强度</Typography>
            </Box>
            <Slider
              value={intensity}
              onChange={(e, newValue) => setIntensity(newValue)}
              min={0}
              max={200}
              valueLabelDisplay="auto"
              sx={{
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)'
                  }
                }
              }}
            />
          </Stack>
        </Paper>
      )}

      <Divider />

      <Box sx={{
        position: 'relative',
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Fade in={true}>
          <Box sx={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <img
              src={previewUrl}
              alt="预览"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                display: 'block'
              }}
            />
            {showComparison && (
              <Box
                component="img"
                src={imageUrl}
                alt="原图"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRight: '2px solid white'
                }}
              />
            )}
          </Box>
        </Fade>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Tooltip title="保存">
          <IconButton
            onClick={() => onSave(previewUrl)}
            color="primary"
            sx={{
              bgcolor: 'primary.light',
              '&:hover': {
                bgcolor: 'primary.main',
                '& .MuiSvgIcon-root': {
                  color: 'white'
                }
              }
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default ImageEffects; 