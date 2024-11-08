import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  IconButton,
  Snackbar,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import yaml from 'js-yaml';
import { motion } from 'framer-motion';

function JsonYamlConverter() {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');
  const [leftFormat, setLeftFormat] = useState('json');
  const [rightFormat, setRightFormat] = useState('yaml');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFormatChange = (side, newFormat) => {
    if (side === 'left') {
      setLeftFormat(newFormat);
    } else {
      setRightFormat(newFormat);
    }
  };

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const formatContent = (content, format) => {
    try {
      if (format === 'json') {
        if (!isValidJson(content)) {
          setSnackbarMessage('错误的JSON格式');
          setSnackbarOpen(true);
          return content;
        }
        const parsed = JSON.parse(content);
        return JSON.stringify(parsed, null, 2);
      } else {
        try {
          const parsed = yaml.load(content);
          return yaml.dump(parsed, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
          });
        } catch (error) {
          setSnackbarMessage('错误的YAML格式');
          setSnackbarOpen(true);
          return content;
        }
      }
    } catch (error) {
      setSnackbarMessage('格式化错误');
      setSnackbarOpen(true);
      return content;
    }
  };

  const handleFormat = (side) => {
    if (side === 'left') {
      const formatted = formatContent(leftContent, leftFormat);
      setLeftContent(formatted);
    } else {
      const formatted = formatContent(rightContent, rightFormat);
      setRightContent(formatted);
    }
  };

  const handleConvert = () => {
    try {
      if (leftFormat === 'json') {
        if (!isValidJson(leftContent)) {
          setSnackbarMessage('错误的JSON格式');
          setSnackbarOpen(true);
          setRightContent('');
          return;
        }
        const jsonObj = JSON.parse(leftContent);
        const yamlStr = yaml.dump(jsonObj, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });
        setRightContent(yamlStr);
      } else {
        try {
          const yamlObj = yaml.load(leftContent);
          const jsonStr = JSON.stringify(yamlObj, null, 2);
          setRightContent(jsonStr);
        } catch (error) {
          setSnackbarMessage('错误的YAML格式');
          setSnackbarOpen(true);
          setRightContent('');
        }
      }
    } catch (error) {
      setSnackbarMessage('转换错误');
      setSnackbarOpen(true);
      setRightContent('');
    }
  };

  const handleSwap = () => {
    setLeftContent(rightContent);
    setRightContent(leftContent);
    setLeftFormat(rightFormat);
    setRightFormat(leftFormat);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage('已复制到剪贴板');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
        {/* 左侧编辑器 */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={leftFormat}
              exclusive
              onChange={(e, value) => value && handleFormatChange('left', value)}
              size="small"
            >
              <ToggleButton value="json">JSON</ToggleButton>
              <ToggleButton value="yaml">YAML</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="格式化">
                <IconButton
                  onClick={() => handleFormat('left')}
                  size="small"
                >
                  <FormatAlignLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="复制">
                <IconButton
                  onClick={() => copyToClipboard(leftContent)}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TextField
            multiline
            fullWidth
            value={leftContent}
            onChange={(e) => setLeftContent(e.target.value)}
            variant="outlined"
            placeholder={`请输入 ${leftFormat.toUpperCase()} 内容...`}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                height: '100%',
                '& textarea': {
                  height: '100% !important',
                  fontFamily: 'monospace',
                  overflowY: 'auto !important',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    backgroundColor: '#F5F5F5'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: '4px',
                    backgroundColor: 'rgba(145, 180, 147, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(145, 180, 147, 0.7)'
                    }
                  },
                  '&::-webkit-scrollbar-track': {
                    borderRadius: '4px',
                    backgroundColor: '#F5F5F5'
                  }
                }
              }
            }}
          />
        </Paper>

        {/* 中间控制按钮 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleConvert}
            sx={{ minWidth: '120px' }}
          >
            转换 →
          </Button>
          <Button
            variant="outlined"
            onClick={handleSwap}
            startIcon={<SwapHorizIcon />}
          >
            交换
          </Button>
        </Box>

        {/* 右侧结果展示 */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={rightFormat}
              exclusive
              onChange={(e, value) => value && handleFormatChange('right', value)}
              size="small"
            >
              <ToggleButton value="json">JSON</ToggleButton>
              <ToggleButton value="yaml">YAML</ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="格式化">
                <IconButton
                  onClick={() => handleFormat('right')}
                  size="small"
                >
                  <FormatAlignLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="复制">
                <IconButton
                  onClick={() => copyToClipboard(rightContent)}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TextField
            multiline
            fullWidth
            value={rightContent}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                height: '100%',
                '& textarea': {
                  height: '100% !important',
                  fontFamily: 'monospace',
                  overflowY: 'auto !important',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    backgroundColor: '#F5F5F5'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: '4px',
                    backgroundColor: 'rgba(145, 180, 147, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(145, 180, 147, 0.7)'
                    }
                  },
                  '&::-webkit-scrollbar-track': {
                    borderRadius: '4px',
                    backgroundColor: '#F5F5F5'
                  }
                }
              }
            }}
          />
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default JsonYamlConverter; 