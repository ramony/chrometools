import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Save as SaveIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

// 默认预设
const DEFAULT_PRESETS = {
  '黑白艺术': {
    effects: [
      { type: 'grayscale', intensity: 100 },
      { type: 'contrast', intensity: 120 }
    ],
    description: '经典黑白效果，增强对比度',
    category: '黑白',
    isDefault: true
  },
  '复古怀旧': {
    effects: [
      { type: 'sepia', intensity: 80 },
      { type: 'brightness', intensity: 90 },
      { type: 'saturate', intensity: 85 }
    ],
    description: '温暖复古风格，轻微褪色',
    category: '复古',
    isDefault: true
  },
  '梦幻效果': {
    effects: [
      { type: 'brightness', intensity: 110 },
      { type: 'blur', intensity: 20 },
      { type: 'saturate', intensity: 120 }
    ],
    description: '明亮柔和的梦幻风格',
    category: '艺术',
    isDefault: true
  },
  '电影感': {
    effects: [
      { type: 'contrast', intensity: 115 },
      { type: 'brightness', intensity: 95 },
      { type: 'saturate', intensity: 90 }
    ],
    description: '电影般的色调效果',
    category: '电影',
    isDefault: true
  }
};

const EffectPresets = ({ onApplyPreset }) => {
  const [presets, setPresets] = useState(() => {
    const savedPresets = localStorage.getItem('imageEffectPresets');
    return savedPresets ? JSON.parse(savedPresets) : DEFAULT_PRESETS;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPreset, setNewPreset] = useState({ name: '', description: '', category: '' });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('effectPresetFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', ...new Set(Object.values(presets).map(p => p.category))];

  useEffect(() => {
    localStorage.setItem('imageEffectPresets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('effectPresetFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSavePreset = () => {
    if (newPreset.name.trim()) {
      setPresets(prev => ({
        ...prev,
        [newPreset.name]: {
          effects: [], // 这里应该从当前应用的效果获取
          description: newPreset.description,
          category: newPreset.category,
          isDefault: false
        }
      }));
      setDialogOpen(false);
      setNewPreset({ name: '', description: '', category: '' });
    }
  };

  const handleDeletePreset = (name) => {
    if (presets[name].isDefault) {
      alert('默认预设不能删除');
      return;
    }
    const newPresets = { ...presets };
    delete newPresets[name];
    setPresets(newPresets);
    setFavorites(prev => prev.filter(f => f !== name));
  };

  const toggleFavorite = (name) => {
    setFavorites(prev =>
      prev.includes(name)
        ? prev.filter(f => f !== name)
        : [...prev, name]
    );
  };

  const filteredPresets = Object.entries(presets).filter(([_, preset]) =>
    selectedCategory === '全部' || preset.category === selectedCategory
  );

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaletteIcon color="primary" />
          特效预设
        </Typography>
        <Tooltip title="保存当前效果为预设">
          <IconButton onClick={() => setDialogOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? "primary" : "default"}
            variant={selectedCategory === category ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filteredPresets.map(([name, preset]) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(name)}
                    color={favorites.includes(name) ? "primary" : "default"}
                  >
                    {favorites.includes(name) ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  <Typography variant="subtitle1">{name}</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {preset.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onApplyPreset(preset.effects)}
                    sx={{
                      background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                      boxShadow: 'none'
                    }}
                  >
                    应用
                  </Button>

                  {!preset.isDefault && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeletePreset(name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>保存预设</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="预设名称"
              value={newPreset.name}
              onChange={(e) => setNewPreset(prev => ({
                ...prev,
                name: e.target.value
              }))}
              fullWidth
            />
            <TextField
              label="预设描述"
              value={newPreset.description}
              onChange={(e) => setNewPreset(prev => ({
                ...prev,
                description: e.target.value
              }))}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="分类"
              value={newPreset.category}
              onChange={(e) => setNewPreset(prev => ({
                ...prev,
                category: e.target.value
              }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleSavePreset}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default EffectPresets; 