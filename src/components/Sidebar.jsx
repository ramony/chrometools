import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import QrCodeIcon from '@mui/icons-material/QrCode';
import MarkdownIcon from '@mui/icons-material/Description';

const menuItems = [
  { id: 'table', name: '表格视图', icon: <TableChartOutlinedIcon /> },
  { id: 'chart', name: '图表分析', icon: <BarChartOutlinedIcon /> },
  { id: 'timeline', name: '时间轴', icon: <TimelineOutlinedIcon /> },
  { id: 'converter', name: 'JSON-YAML', icon: <CodeIcon /> },
  { id: 'image', name: '图片处理', icon: <ImageIcon /> },
  { id: 'qrcode', name: '二维码', icon: <QrCodeIcon /> },
  { id: 'markdown', name: 'Markdown', icon: <MarkdownIcon /> },
];

const Sidebar = ({ activeView, onViewChange }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeView === item.id}
              onClick={() => onViewChange(item.id)}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(145, 180, 147, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(145, 180, 147, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(145, 180, 147, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: activeView === item.id ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar; 