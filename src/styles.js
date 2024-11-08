import { styled } from '@mui/material/styles';
import { TableContainer, TableCell, TableRow, FormControl } from '@mui/material';

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