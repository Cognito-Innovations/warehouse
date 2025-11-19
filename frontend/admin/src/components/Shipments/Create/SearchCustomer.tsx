import { Box, CircularProgress, TextField } from "@mui/material";
import { useState } from "react"

interface SearchCustomerProps {
    onSearch: (suiteNo: string) => Promise<void>;
    loading: boolean;
}

const SearchCustomer: React.FC<SearchCustomerProps> = ({ onSearch, loading }) => {
    const [searchValue, setSearchvalue] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            onSearch(searchValue.trim())
        }
    };

    return (
        <Box width="100%" mt={2}>
            <TextField 
              fullWidth
              label="Search by Suite Number"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchvalue(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: loading ? <CircularProgress size={20} /> : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
        </Box>
    )
}

export default SearchCustomer;