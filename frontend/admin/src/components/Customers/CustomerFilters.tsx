import { useEffect, useState } from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import type { Customer } from '../../types';

interface CustomerFiltersProps {
  users: Customer[];
  onFilter: (list: Customer[]) => void;
}

const CustomerFilters = ({ users, onFilter }: CustomerFiltersProps) => {
  const [emailVerified, setEmailVerified] = useState<'All' | 'YES' | 'NO'>('All');

  useEffect(() => {
    const filtered = users.filter(user => {
      if (emailVerified === 'All') return true;
      return (user.email_verified ? 'YES' : 'NO') === emailVerified;
    });
    onFilter(filtered);
  }, [emailVerified, users, onFilter]);

  const renderSelect = (
    label: string,
    value: 'All' | 'YES' | 'NO',
    type: 'email'
  ) => (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={e => {
          if (type === 'email') {
            setEmailVerified(e.target.value as 'All' | 'YES' | 'NO');
          }
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="YES">Yes</MenuItem>
        <MenuItem value="NO">No</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Paper
      sx={{
        borderRadius: 3,
        boxShadow: 'none',
        p: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <IconButton>
        <FilterAltOutlinedIcon color="action" />
      </IconButton>
      {renderSelect('Email Verified', emailVerified, 'email')}
    </Paper>
  );
};

export default CustomerFilters;