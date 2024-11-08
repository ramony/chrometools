import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Button,
  Slider,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion } from 'framer-motion';
import UploadIcon from '@mui/icons-material/Upload';
import CropIcon from '@mui/icons-material/Crop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';

function ImageProcessor() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const [quality, setQuality] = useState(0.92);
  const [format, setFormat] = useState('image/jpeg');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(450);

  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const imageAspect = naturalWidth / naturalHeight;

    // 根据当前选择的宽高比和图片尺寸计算裁剪框大小
    let cropWidth, cropHeight;

    // 计算最大可能的裁剪框尺寸
    if (imageAspect > aspect) {
      // 图片较宽，以高度为基准
      cropHeight = 90;  // 使用90%的高度
      cropWidth = cropHeight * aspect;  // 根据宽高比计算宽度
    } else {
      // 图片较高，以宽度为基准
      cropWidth = 90;  // 使用90%的宽度
      cropHeight = cropWidth / aspect;  // 根据宽高比计算高度
    }

    // 计算居中位置
    const x = (100 - cropWidth) / 2;
    const y = (100 - cropHeight) / 2;

    const crop = {
      unit: '%',
      x,
      y,
      width: cropWidth,
      height: cropHeight
    };

    setCrop(crop);

    // 更新输出尺寸以匹配裁剪框比例
    const newWidth = Math.round(naturalWidth * (cropWidth / 100));
    const newHeight = Math.round(newWidth / aspect);
    setWidth(newWidth);
    setHeight(newHeight);
  }

  const onCropChange = (crop, percentCrop) => {
    // 确保裁剪框不会超出图片边界
    const boundedCrop = {
      ...percentCrop,
      x: Math.max(0, Math.min(percentCrop.x, 100 - percentCrop.width)),
      y: Math.max(0, Math.min(percentCrop.y, 100 - percentCrop.height))
    };

    // 额外检查确保裁剪框底部不会超出图片
    if (boundedCrop.y + boundedCrop.height > 100) {
      boundedCrop.y = 100 - boundedCrop.height;
    }

    // 确保裁剪框顶部不会超出图片
    if (boundedCrop.y < 0) {
      boundedCrop.y = 0;
    }

    // 确保裁剪框左侧不会超出图片
    if (boundedCrop.x < 0) {
      boundedCrop.x = 0;
    }

    // 确保裁剪框右侧不会超出图片
    if (boundedCrop.x + boundedCrop.width > 100) {
      boundedCrop.x = 100 - boundedCrop.width;
    }

    setCrop(boundedCrop);
  };

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!image || !ctx || !completedCrop) {
      return;
    }

    // 设置画布尺寸为目标尺寸
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 计算裁剪区域在原图中的实际位置和尺寸
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const sourceX = completedCrop.x * scaleX;
    const sourceY = completedCrop.y * scaleY;
    const sourceWidth = completedCrop.width * scaleX;
    const sourceHeight = completedCrop.height * scaleY;

    // 绘制裁剪后的图片
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        format,
        quality
      );
    });

    if (!blob) {
      return;
    }

    const fileExtension = format === 'image/jpeg' ? 'jpg' : 'png';
    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = URL.createObjectURL(blob);
      hiddenAnchorRef.current.download = `processed-image.${fileExtension}`;
      hiddenAnchorRef.current.click();
    }
  }

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const imageAspect = naturalWidth / naturalHeight;

      // 计算新的裁剪框尺寸
      let cropWidth, cropHeight;

      // 根据新的宽高比计算裁剪框尺寸
      if (newAspect > 1) {
        // 横向裁剪框（如16:9, 4:3）
        cropWidth = 90;  // 使用90%的宽度
        cropHeight = cropWidth / newAspect;  // 根据宽高比计算高度
      } else {
        // 纵向裁剪框（如9:16）或正方形（1:1）
        cropHeight = 90;  // 使用90%的高度
        cropWidth = cropHeight * newAspect;  // 根据宽高比计算宽度
      }

      // 计算居中位置
      const x = (100 - cropWidth) / 2;
      const y = (100 - cropHeight) / 2;

      const newCrop = {
        unit: '%',
        x,
        y,
        width: cropWidth,
        height: cropHeight
      };

      setCrop(newCrop);

      // 更新输出尺寸以匹配新的宽高比
      const newWidth = Math.round(naturalWidth * (cropWidth / 100));
      const newHeight = Math.round(newWidth / newAspect);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    // 根据宽高比计算新的高度
    const newHeight = Math.round(newWidth / aspect);
    setHeight(newHeight);
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    // 根据宽高比计算新的宽度
    const newWidth = Math.round(newHeight * aspect);
    setWidth(newWidth);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Paper sx={{ p: 2, position: 'relative', zIndex: 0 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
          >
            选择图片
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              hidden
            />
          </Button>
          {imgSrc && (
            <>
              <Tooltip title="重置">
                <IconButton onClick={() => setImgSrc('')}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>宽高比</InputLabel>
                <Select
                  value={aspect}
                  label="宽高比"
                  onChange={(e) => handleAspectChange(e.target.value)}
                  size="small"
                >
                  <MenuItem value={16 / 9}>16:9</MenuItem>
                  <MenuItem value={4 / 3}>4:3</MenuItem>
                  <MenuItem value={1}>1:1</MenuItem>
                  <MenuItem value={9 / 16}>9:16</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Stack>

        {imgSrc && (
          <Box sx={{
            width: '100%',
            height: '60vh',
            mb: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            position: 'relative',
            zIndex: 0,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(145, 180, 147, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(145, 180, 147, 0.7)'
              }
            },
            '& .ReactCrop': {
              minWidth: 'min-content',
              minHeight: 'min-content'
            }
          }}>
            <Box sx={{
              padding: '20px',
              display: 'inline-block',
              minWidth: 'min-content',
              minHeight: 'min-content'
            }}>
              <ReactCrop
                crop={crop}
                onChange={onCropChange}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={100}
                minHeight={100}
                keepSelection
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    display: 'block'
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </Box>
          </Box>
        )}

        {completedCrop && (
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 0 }}>
            <Typography gutterBottom>输出设置</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="宽度"
                type="number"
                size="small"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
              <TextField
                label="高度"
                type="number"
                size="small"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>格式</InputLabel>
                <Select
                  value={format}
                  label="格式"
                  onChange={(e) => setFormat(e.target.value)}
                  size="small"
                >
                  <MenuItem value="image/jpeg">JPG</MenuItem>
                  <MenuItem value="image/png">PNG</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {format === 'image/jpeg' && (
              <Box>
                <Typography gutterBottom>质量: {Math.round(quality * 100)}%</Typography>
                <Slider
                  value={quality}
                  onChange={(_, newValue) => setQuality(newValue)}
                  min={0.1}
                  max={1}
                  step={0.01}
                />
              </Box>
            )}

            <Button
              variant="contained"
              onClick={onDownloadCropClick}
              startIcon={<DownloadIcon />}
            >
              导出图片
            </Button>
          </Stack>
        )}
      </Paper>
      <a
        ref={hiddenAnchorRef}
        href="#"
        download
        style={{
          position: 'absolute',
          top: '-200vh',
          visibility: 'hidden',
        }}
      >
        Hidden download
      </a>
    </Box>
  );
}

export default ImageProcessor; 