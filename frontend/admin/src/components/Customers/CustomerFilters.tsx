import { useState } from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { customers, type Customer } from '../../data/customers';

const CustomerFilters = ({ onFilter }: { onFilter: (list: Customer[]) => void }) => {
  const [email, setEmail] = useState<'All' | 'YES' | 'NO'>('All');

  const handleChange = (type: 'status' | 'verify' | 'email', value: any) => {
    if (type === 'email') setEmail(value);
    const filtered = customers.filter(c =>
      (email === 'All' || (c.emailVerifiedOn ? 'YES' : 'NO') === (type === 'email' ? value : email))
    );
    onFilter(filtered);
  };

  const renderSelect = (label: string, value: any, type: 'status' | 'verify' | 'email') => (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={e => handleChange(type, e.target.value)}>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="YES">YES</MenuItem>
        <MenuItem value="NO">NO</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 'none', p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton>
        <FilterAltOutlinedIcon color="action" />
     </IconButton>
  
      {renderSelect('Email Verified', email, 'email')}
    </Paper>
  );
};

export default CustomerFilters;