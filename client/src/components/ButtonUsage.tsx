import React from 'react';
import Button from '@mui/material/Button';

interface ButtonUsageProps {
  label: string;
  onClick?: () => void; // Optional onClick prop
}

const ButtonUsage: React.FC<ButtonUsageProps> = ({ label, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        bgcolor: '#90D7FF', // Bright blue background
        color: '#fff', // White text color
        padding: '8px 16px', // Custom padding
        borderRadius: '8px', // Rounded corners
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        '&:hover': {
          bgcolor: '#6BCFFF', // Slightly darker blue on hover
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ButtonUsage;
