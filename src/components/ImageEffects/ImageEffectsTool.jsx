import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Container,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Fade,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Compare as CompareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import ImageEffects from './ImageEffects';
import EffectPresets from './EffectPresets';
import BatchProcessor from './BatchProcessor';
import AdvancedEffects from './AdvancedEffects';
import ImageProcessor from './ImageProcessor';

const ImageEffectsTool = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [effectParams, setEffectParams] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // 压缩图片
        const compressedBlob = await ImageProcessor.compressImage(file, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.8
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target.result);
          setProcessedImage('');
          setShowComparison(false);
          setSelectedEffect(null);
          setEffectParams({});
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('图片处理失败:', error);
        alert('图片处理失败，请重试');
      }
    }
  };

  const handleSave = async () => {
    if (processedImage) {
      const timestamp = new Date().getTime();
      ImageProcessor.downloadImage(
        processedImage,
        `processed-image-${timestamp}.png`
      );
    }
  };

  const handleReset = () => {
    if (window.confirm('确定要重新上传图片吗？当前的处理进度将会丢失。')) {
      setImageUrl('');
      setProcessedImage('');
      setSelectedEffect(null);
      setEffectParams({});
      setShowComparison(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* 顶部工具栏 */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h5" sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 700
          }}>
            图片特效工具
          </Typography>
          {imageUrl && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="对比原图">
                <IconButton
                  onClick={() => setShowComparison(!showComparison)}
                  color={showComparison ? "primary" : "default"}
                >
                  <CompareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="重新上传">
                <IconButton onClick={handleReset}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {processedImage && (
                <Tooltip title="保存">
                  <IconButton
                    color="primary"
                    onClick={handleSave}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>

        {!imageUrl ? (
          <Paper
            sx={{
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3
                }}
              >
                选择图片
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              支持 JPG、PNG 格式，建议图片大小不超过 10MB
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            <Paper sx={{ borderRadius: 3 }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ px: 2, pt: 2 }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="预设效果" />
                <Tab label="基础特效" />
                <Tab label="高级特效" />
                <Tab label="批量处理" />
              </Tabs>
              <Divider sx={{ mt: 1 }} />
              <Box sx={{ p: 3 }}>
                <Fade in={true}>
                  <Box>
                    {currentTab === 0 && (
                      <EffectPresets
                        onApplyPreset={(preset) => {
                          setSelectedEffect(preset.type);
                          setEffectParams(preset.params);
                        }}
                      />
                    )}
                    {currentTab === 1 && (
                      <ImageEffects
                        imageUrl={imageUrl}
                        onSave={setProcessedImage}
                        showComparison={showComparison}
                      />
                    )}
                    {currentTab === 2 && (
                      <AdvancedEffects
                        imageUrl={imageUrl}
                        onSave={setProcessedImage}
                        selectedEffect={selectedEffect}
                        effectParams={effectParams}
                        onEffectChange={(effect, params) => {
                          setSelectedEffect(effect);
                          setEffectParams(params);
                        }}
                      />
                    )}
                    {currentTab === 3 && (
                      <BatchProcessor
                        selectedEffect={selectedEffect}
                        effectParams={effectParams}
                        onProcessComplete={(results) => {
                          // 处理批量结果
                        }}
                      />
                    )}
                  </Box>
                </Fade>
              </Box>
            </Paper>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default ImageEffectsTool; 