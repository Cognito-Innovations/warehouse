import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';

interface AddRackFormProps {
  onAdd: (label: string, colorCode: string) => void;
  onCancel: () => void;
}

const AddRackForm: React.FC<AddRackFormProps> = ({ onAdd, onCancel }) => {
  const [label, setLabel] = useState('');
  const [colorCode, setColorCode] = useState('#000000');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!label.trim()) {
      setError('Label is required.');
      return;
    }
    setError('');
    onAdd(label, colorCode);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Label <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Box>
        <Box>
           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Color Code <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="color"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            sx={{ '& .MuiInputBase-input': { height: 40, p: '4px' } }}
          />
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddRackForm;