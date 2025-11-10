'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '@/hooks/useDebounce';

export interface FilterState {
  searchQuery: string;
}

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductSearch({ searchQuery, onSearchChange }: ProductSearchProps) {
  const theme = useTheme();
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const debouncedSearchQuery = useDebounce(searchInput, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      onSearchChange(debouncedSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  return (
    <TextField
      fullWidth
      placeholder="Buscar por nombre o tipo..."
      value={searchInput}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e)}
      size="medium"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[50],
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
      }}
    />
  );
}

