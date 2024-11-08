import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TableView from './components/TableView';
import JsonYamlConverter from './components/JsonYamlConverter';
import ImageProcessor from './components/ImageProcessor';
import QRCodeGenerator from './components/QRCodeGenerator';
import MarkdownEditor from './components/MarkdownEditor';

// 创建自定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#91B493',
      light: '#B5C9B7',
      dark: '#728F74'
    },
    secondary: {
      main: '#D4E4D4',
    },
    background: {
      default: '#F5F9F5'
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
  }
});

function App() {
  const [jsonData, setJsonData] = useState({ header: [], data: [] });
  const [selectedFile, setSelectedFile] = useState('data.json');
  const [activeView, setActiveView] = useState('table');

  const jsonFiles = {
    'data.json': '👥 人员数据',
    'data2.json': '🛍️ 产品数据'
  };

  useEffect(() => {
    loadJsonData(selectedFile);
  }, [selectedFile]);

  const loadJsonData = async (filename) => {
    try {
      const response = await fetch(filename);
      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      console.error('JSON 加载错误:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      }
    })
  };

  const renderContent = () => {
    switch (activeView) {
      case 'table':
        return (
          <TableView
            jsonData={jsonData}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            jsonFiles={jsonFiles}
            tableRowVariants={tableRowVariants}
          />
        );
      case 'chart':
        return <div>图表分析功能开发中...</div>;
      case 'timeline':
        return <div>时间轴功能开发中...</div>;
      case 'converter':
        return <JsonYamlConverter />;
      case 'image':
        return <ImageProcessor />;
      case 'qrcode':
        return <QRCodeGenerator />;
      case 'markdown':
        return <MarkdownEditor />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: 'flex',
          padding: '12px',
          gap: '16px',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #EFF5F0 0%, #F5F9F5 100%)',
        }}
      >
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              mb: 3,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(145, 180, 147, 0.2)',
            }}
          >
            {activeView === 'table' ? '数据表格' :
              activeView === 'chart' ? '图表分析' :
                activeView === 'converter' ? 'JSON-YAML' :
                  activeView === 'image' ? '图片处理' :
                    activeView === 'qrcode' ? '二维码' :
                      activeView === 'markdown' ? 'Markdown' : '时间轴'}
          </Typography>

          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 