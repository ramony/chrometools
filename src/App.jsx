import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation
} from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { routes } from './routes';
import BuildIcon from '@mui/icons-material/Build';

const DRAWER_WIDTH = 260;

// 导航组件
function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo 和标题区域 */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          }}
        >
          <BuildIcon />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          开发工具集
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* 导航菜单 */}
      <List sx={{ px: 2 }}>
        {routes.map(({ path, label, icon: Icon }) => (
          <ListItem key={path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={path}
              selected={currentPath === path}
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&.active': {
                  bgcolor: 'primary.light',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  bgcolor: 'primary.light',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: currentPath === path ? 'primary.main' : 'text.secondary',
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: currentPath === path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 底部版权信息 */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          © 2023 开发工具集
        </Typography>
      </Box>
    </Drawer>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Navigation />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: '100vh',
            background: 'linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              minHeight: 'calc(100vh - 64px)',
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={<Component />}
                />
              ))}
            </Routes>
          </Paper>
        </Box>
      </Box>
    </Router>
  );
}

export default App; 