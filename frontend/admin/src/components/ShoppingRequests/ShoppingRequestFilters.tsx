import React, { useCallback, useEffect, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';

import { getOriginOptions, getTargetOptions } from '../../services/api.services';
import { LoadingEndAdornment } from '../common/LoadingEndAdornment';
import type { ShoppingRequestFiltersProps } from '../../types';

const ShoppingRequestFilters: React.FC<ShoppingRequestFiltersProps> = ({
  originCountry,
  targetCountry,
  onOriginChange,
  onTargetChange,
}) => {
  const [originOptions, setOriginOptions] = useState<string[]>([]);
  const [targetOptions, setTargetOptions] = useState<string[]>([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);

  const fetchFilterOptions = useCallback(async () => {
    setOriginLoading(true);
    setTargetLoading(true);

    try {
      const [origins, targets] = await Promise.all([
        getOriginOptions(),
        getTargetOptions(),
      ]);

      setOriginOptions(origins);
      setTargetOptions(targets);
    } catch (error) {
      console.error('Failed to fetch filter options', error);
    } finally {
      setOriginLoading(false);
      setTargetLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {/* Origin */}
      <TextField
        select
        size="small"
        label="Origin"
        value={originCountry ?? 'All'}
        disabled={originLoading}
        onChange={(e) =>
          onOriginChange(e.target.value === 'All' ? null : e.target.value)
        }
        sx={{ minWidth: 160 }}
        SelectProps={{
          IconComponent: originLoading ? () => null: undefined,
        }}
        InputProps={{
          endAdornment: <LoadingEndAdornment loading={originLoading} />,
        }}
      >
        <MenuItem value="All">All Origins</MenuItem>
        {originOptions.map(country => (
          <MenuItem key={country} value={country}>
            {country}
          </MenuItem>
        ))}
      </TextField>

      {/* Target */}
      <TextField
        select
        size="small"
        label="Target"
        value={targetCountry ?? 'All'}
        disabled={targetLoading}
        onChange={(e) =>
          onTargetChange(e.target.value === 'All' ? null : e.target.value)
        }
        sx={{ minWidth: 160 }}
        SelectProps={{
          IconComponent: targetLoading ? () => null: undefined,
        }}
        InputProps={{
          endAdornment: <LoadingEndAdornment loading={targetLoading} />,
        }}
      >
        <MenuItem value="All">All Targets</MenuItem>
        {targetOptions.map(country => (
          <MenuItem key={country} value={country}>
            {country}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default ShoppingRequestFilters;
