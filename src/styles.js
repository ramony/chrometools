import { styled } from '@mui/material/styles';
import { TableContainer, TableCell, TableRow, FormControl } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(145, 180, 147, 0.15)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  '& .MuiTable-root': {
    borderCollapse: 'collapse',
    borderSpacing: 0
  }
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px 12px',
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  '&.MuiTableCell-body': {
    fontSize: '0.875rem',
    color: '#4A4A4A',
    lineHeight: 1.4
  }
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(145, 180, 147, 0.05)'
  },
  '&:hover': {
    backgroundColor: 'rgba(145, 180, 147, 0.1)',
    transition: 'all 0.2s ease'
  },
  height: '40px'
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '15px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(145, 180, 147, 0.2)'
    },
    '& fieldset': {
      borderColor: theme.palette.primary.light
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main
  }
}));

export const globalStyles = {
  // 通用容器样式
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  // 图片特效工具样式
  imageEffects: {
    // 上传区域
    uploadZone: {
      p: 4,
      border: '2px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      textAlign: 'center',
      bgcolor: 'background.default',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: 'primary.main',
        bgcolor: alpha('#1976d2', 0.04)
      }
    },

    // 预览区域
    previewArea: {
      width: '100%',
      minHeight: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'background.default',
      borderRadius: 1,
      overflow: 'hidden',
      position: 'relative'
    },

    // 控制面板
    controlPanel: {
      p: 2,
      border: 1,
      borderColor: 'divider',
      borderRadius: 1,
      bgcolor: 'background.paper'
    },

    // 特效预设卡片
    presetCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 2
      }
    },

    // 批量处理区域
    batchArea: {
      mt: 2,
      p: 2,
      border: 1,
      borderColor: 'divider',
      borderRadius: 1,
      bgcolor: 'background.paper'
    }
  },

  // 动画效果
  animations: {
    fadeIn: {
      animation: 'fadeIn 0.3s ease-in-out',
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0
        },
        '100%': {
          opacity: 1
        }
      }
    },
    slideIn: {
      animation: 'slideIn 0.3s ease-in-out',
      '@keyframes slideIn': {
        '0%': {
          transform: 'translateY(20px)',
          opacity: 0
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1
        }
      }
    }
  },

  // 响应式布局
  responsive: {
    imageGrid: {
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)'
      }
    }
  },

  // 工具栏样式
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    p: 1,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper'
  },

  // 进度条样式
  progress: {
    position: 'relative',
    height: 4,
    borderRadius: 2,
    bgcolor: 'background.default',
    '.MuiLinearProgress-bar': {
      borderRadius: 2
    }
  }
};

export default globalStyles; 