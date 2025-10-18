// components/filters/modals/LocationModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { Modal, Box, Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

export default function LocationModal({ open, onClose, filters, handleFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => setLocalFilters(filters), [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    handleFilterChange(localFilters);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white rounded-2xl shadow-lg p-6 w-[95%] max-w-md mx-auto mt-24 space-y-4">
        <Typography variant="h6" className="font-semibold">Select Location</Typography>

        <FormControl fullWidth>
          <InputLabel>State</InputLabel>
          <Select
            value={localFilters.state || ''}
            label="State"
            onChange={(e) => handleChange('state', e.target.value)}
          >
            <MenuItem value="California">California</MenuItem>
            <MenuItem value="Texas">Texas</MenuItem>
            <MenuItem value="Florida">Florida</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!localFilters.state}>
          <InputLabel>City</InputLabel>
          <Select
            value={localFilters.city || ''}
            label="City"
            onChange={(e) => handleChange('city', e.target.value)}
          >
            {localFilters.state === 'California' && (
              <>
                <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                <MenuItem value="San Diego">San Diego</MenuItem>
              </>
            )}
            {localFilters.state === 'Texas' && (
              <>
                <MenuItem value="Houston">Houston</MenuItem>
                <MenuItem value="Dallas">Dallas</MenuItem>
              </>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!localFilters.city}>
          <InputLabel>Neighborhood</InputLabel>
          <Select
            value={localFilters.neighborhood || ''}
            label="Neighborhood"
            onChange={(e) => handleChange('neighborhood', e.target.value)}
          >
            <MenuItem value="Downtown">Downtown</MenuItem>
            <MenuItem value="Suburban">Suburban</MenuItem>
          </Select>
        </FormControl>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply</Button>
        </div>
      </Box>
    </Modal>
  );
}
