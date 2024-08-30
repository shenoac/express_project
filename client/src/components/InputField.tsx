import React, { forwardRef } from 'react';
import TextField from '@mui/material/TextField';

interface InputFieldProps {
  label: string;
  placeholder?: string;
}

// Using forwardRef to pass ref to the TextField
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ label, placeholder }, ref) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      placeholder={placeholder}
      inputRef={ref} // Attach the ref to the TextField
      fullWidth
      sx={{
        marginBottom: '10px',
        '& .MuiOutlinedInput-root': {
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
        '& .MuiInputLabel-root': {
          color: '#555',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#BFD0E0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#90D7FF',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#90D7FF',
        },
      }}
    />
  );
});

export default InputField;
