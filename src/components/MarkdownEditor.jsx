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
  Divider,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const previewRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setSnackbarMessage('已复制到剪贴板');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('复制失败');
      setSnackbarOpen(true);
    }
  };

  const exportToImage = async (format) => {
    if (!previewRef.current) return;

    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.padding = '40px';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.width = '800px';
      tempContainer.innerHTML = previewRef.current.innerHTML;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        windowWidth: 800,
        logging: false,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `markdown-export.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.92 : undefined);
      link.click();

      setSnackbarMessage('导出成功');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('导出错误:', err);
      setSnackbarMessage('导出失败');
      setSnackbarOpen(true);
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;

    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.padding = '40px';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.width = '800px';
      tempContainer.innerHTML = previewRef.current.innerHTML;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        windowWidth: 800,
        logging: false,
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save('markdown-export.pdf');

      setSnackbarMessage('导出成功');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('导出错误:', err);
      setSnackbarMessage('导出失败');
      setSnackbarOpen(true);
    }
  };

  const exportToHTML = () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Markdown Export</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
            img { max-width: 100%; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
          </style>
        </head>
        <body>
          ${previewRef.current.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'markdown-export.html';
      link.click();
      URL.revokeObjectURL(url);

      setSnackbarMessage('导出成功');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('导出失败');
      setSnackbarOpen(true);
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'png':
      case 'jpg':
        exportToImage(exportFormat);
        break;
      case 'pdf':
        exportToPDF();
        break;
      case 'html':
        exportToHTML();
        break;
      default:
        break;
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>导出格式</InputLabel>
            <Select
              value={exportFormat}
              label="导出格式"
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <MenuItem value="png">PNG</MenuItem>
              <MenuItem value="jpg">JPG</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={exportFormat === 'pdf' ? <PictureAsPdfIcon /> :
              exportFormat === 'html' ? <CodeIcon /> : <ImageIcon />}
            onClick={handleExport}
            disabled={!markdown}
          >
            导出
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            disabled={!markdown}
          >
            复制
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
          {/* 编辑器 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Markdown 编辑
            </Typography>
            <TextField
              multiline
              fullWidth
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="在此输入 Markdown 内容..."
              sx={{
                height: 'calc(100% - 30px)',
                '& .MuiInputBase-root': {
                  height: '100%',
                  '& textarea': {
                    height: '100% !important',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: 1.6,
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
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* 预览 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              预览
            </Typography>
            <Paper
              ref={previewRef}
              sx={{
                height: 'calc(100% - 30px)',
                overflow: 'auto',
                p: 2,
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
                },
                '& img': {
                  maxWidth: '100%'
                },
                '& pre': {
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto'
                },
                '& code': {
                  backgroundColor: '#f5f5f5',
                  p: 0.5,
                  borderRadius: 0.5
                }
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown || '预览区域'}
              </ReactMarkdown>
            </Paper>
          </Box>
        </Box>
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

export default MarkdownEditor; 