import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import { StyledTableContainer, StyledTableCell, StyledTableRow, StyledFormControl } from '../styles';

function TableView({ jsonData, selectedFile, setSelectedFile, jsonFiles, tableRowVariants }) {
  return (
    <Box sx={{ width: '100%' }}>
      <StyledFormControl
        fullWidth
        sx={{
          mb: 2,
          '& .MuiInputBase-root': {
            height: '40px'
          }
        }}
      >
        <InputLabel>选择数据集</InputLabel>
        <Select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          label="选择数据集"
        >
          {Object.entries(jsonFiles).map(([file, label]) => (
            <MenuItem key={file} value={file}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>

      <StyledTableContainer
        component={Paper}
        sx={{
          mb: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(145, 180, 147, 0.2)'
          },
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto'
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {jsonData.header.map((header, index) => (
                <StyledTableCell
                  key={index}
                  align="center"
                  sx={{ position: 'sticky', top: 0, zIndex: 1 }}
                >
                  {header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {jsonData.data.map((row, rowIndex) => (
              <StyledTableRow
                key={rowIndex}
                component={motion.tr}
                variants={tableRowVariants}
                initial="hidden"
                animate="visible"
                custom={rowIndex}
              >
                {Object.values(row).map((cell, cellIndex) => (
                  <StyledTableCell key={cellIndex} align="center">
                    {cell}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}

export default TableView; 