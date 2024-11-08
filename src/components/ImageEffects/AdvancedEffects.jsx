import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  IconButton
} from '@mui/material';
import { effectAlgorithms } from './effectAlgorithms';
import { CompareArrows as CompareIcon } from '@mui/icons-material';

// 高级特效定义
const ADVANCED_EFFECTS = {
  sharpen: {
    name: '锐化',
    description: '增强图片细节和边缘',
    params: {
      intensity: { min: 0, max: 100, default: 50, label: '强度' }
    }
  },
  emboss: {
    name: '浮雕',
    description: '创建浮雕艺术效果',
    params: {
      intensity: { min: 0, max: 100, default: 50, label: '强度' },
      angle: { min: 0, max: 360, default: 45, label: '角度' }
    }
  },
  noise: {
    name: '噪点',
    description: '添加随机噪点效果',
    params: {
      amount: { min: 0, max: 100, default: 20, label: '数量' },
      size: { min: 1, max: 10, default: 1, label: '大小' }
    }
  },
  vignette: {
    name: '晕影',
    description: '边缘渐变暗效果',
    params: {
      intensity: { min: 0, max: 100, default: 50, label: '强度' },
      size: { min: 0, max: 100, default: 50, label: '大小' }
    }
  },
  colorSplit: {
    name: '色调分离',
    description: '创意色彩分离效果',
    params: {
      amount: { min: 0, max: 100, default: 50, label: '强度' },
      hue: { min: 0, max: 360, default: 180, label: '色相' }
    }
  },
  mosaic: {
    name: '马赛克',
    description: '像素化马赛克效果',
    params: {
      size: { min: 1, max: 50, default: 10, label: '大小' }
    }
  }
};

const AdvancedEffects = ({ imageUrl, onSave }) => {
  const [selectedEffect, setSelectedEffect] = useState('');
  const [effectParams, setEffectParams] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const requestAnimationRef = useRef();
  const originalImageRef = useRef(null);

  // 生成预览图的函数
  const generateEffectPreview = async (effectKey) => {
    if (!imageUrl) return null;

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imageUrl;
    });

    // 创建一个小尺寸的画布用于预览
    const previewCanvas = document.createElement('canvas');
    const previewSize = 100;
    const scale = Math.min(previewSize / img.width, previewSize / img.height);
    previewCanvas.width = img.width * scale;
    previewCanvas.height = img.height * scale;

    const ctx = previewCanvas.getContext('2d');

    // 绘制缩放后的图片
    ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);

    // 应用特效
    if (effectAlgorithms[effectKey]) {
      const defaultParams = {};
      Object.entries(ADVANCED_EFFECTS[effectKey].params).forEach(([key, config]) => {
        defaultParams[key] = config.default;
      });
      effectAlgorithms[effectKey](ctx, img, defaultParams);
    }

    return previewCanvas.toDataURL();
  };

  // 使用 state 存储预览图
  const [effectPreviews, setEffectPreviews] = useState({});

  // 生成所有特效的预览图
  useEffect(() => {
    if (!imageUrl) return;

    const generatePreviews = async () => {
      const previews = {};
      for (const effectKey of Object.keys(ADVANCED_EFFECTS)) {
        try {
          previews[effectKey] = await generateEffectPreview(effectKey);
        } catch (error) {
          console.error(`生成预览图失败: ${effectKey}`, error);
        }
      }
      setEffectPreviews(previews);
    };

    generatePreviews();
  }, [imageUrl]);

  // 加载原始图片
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        // 初始化画布尺寸
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // 优化的特效应用函数
  const applyEffect = useCallback(() => {
    if (!originalImageRef.current || !selectedEffect) return;

    // 取消之前的动画帧请求
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
    }

    requestAnimationRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制原图
      ctx.drawImage(originalImageRef.current, 0, 0);

      // 应用特效
      if (effectAlgorithms[selectedEffect]) {
        try {
          effectAlgorithms[selectedEffect](ctx, originalImageRef.current, effectParams);
          // 只在非拖动状态下更新预览URL
          if (!isDragging) {
            setPreviewUrl(canvas.toDataURL());
          }
        } catch (error) {
          console.error('特效应用失败:', error);
        }
      }
    });
  }, [selectedEffect, effectParams, isDragging]);

  // 参数变化时应用特效
  useEffect(() => {
    applyEffect();
  }, [applyEffect]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h6">高级特效</Typography>

      {/* 特效选择网格 */}
      <Grid container spacing={2}>
        {Object.entries(ADVANCED_EFFECTS).map(([key, effect]) => (
          <Grid item xs={6} sm={4} md={3} key={key}>
            <Paper
              elevation={selectedEffect === key ? 3 : 1}
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedEffect === key ? 2 : 1,
                borderColor: selectedEffect === key ? 'primary.main' : 'divider',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => {
                setSelectedEffect(key);
                const defaultParams = {};
                Object.entries(effect.params).forEach(([param, config]) => {
                  defaultParams[param] = config.default;
                });
                setEffectParams(defaultParams);
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Typography variant="subtitle2">{effect.name}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="center"
                >
                  {effect.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 预览和参数控制区域 */}
      {selectedEffect && (
        <Stack spacing={3}>
          {/* 参数控制面板 */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">
                {ADVANCED_EFFECTS[selectedEffect].name} 参数设置
              </Typography>
              {Object.entries(ADVANCED_EFFECTS[selectedEffect].params).map(([param, config]) => (
                <Box key={param}>
                  <Typography variant="body2" gutterBottom>
                    {config.label}
                  </Typography>
                  <Slider
                    value={effectParams[param] || config.default}
                    onChange={(e, value) => {
                      setIsDragging(true);
                      setEffectParams(prev => ({
                        ...prev,
                        [param]: value
                      }));
                    }}
                    onChangeCommitted={() => {
                      setIsDragging(false);
                      const canvas = canvasRef.current;
                      setPreviewUrl(canvas.toDataURL());
                    }}
                    min={config.min}
                    max={config.max}
                    valueLabelDisplay="auto"
                  />
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* 预览区域 */}
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 400px)', // 动态计算高度
            minHeight: 500, // 最小高度
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <canvas
              ref={canvasRef}
              style={{
                display: isDragging ? 'block' : 'none',
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {!isDragging && previewUrl && (
              <img
                src={previewUrl}
                alt="预览"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
            {processing && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1
              }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default AdvancedEffects; 