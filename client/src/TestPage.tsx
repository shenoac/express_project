import React from 'react';
import { Box, Typography, List } from '@mui/material';
import Messages from './containers/Messages';
import Rooms from './containers/Rooms';
import { useSockets } from './context/SocketContext';

const drawerWidth = 240;

const App: React.FC = () => {
  const { username } = useSockets();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#FFF', // Background color for the "border"
        padding: '16px', // Padding around the entire container
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1200px',
          bgcolor: '#B8B3BE', // White background for the inner content
          borderRadius: '16px', // Rounded corners for the outer box
          boxShadow: 3, // Add some shadow for a slight elevation effect
          overflow: 'hidden', // Prevents overflow issues
          height: '90vh'
        }}
      >
        {/* Sidebar as a Box */}
        <Box
          sx={{
            width: drawerWidth,
            bgcolor: '#BFD0E0', // Sidebar color
            color: '#fff',
            padding: '16px',
            borderRight: '1px solid #ccc', // Optional: border to separate the sidebar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Rooms
          </Typography>
          <List sx={{ width: '100%' }}>
            <Rooms /> {/* Assume Rooms component renders a list of rooms */}
          </List>
        </Box>

        {/* Main content area next to the Sidebar */}
        <Box
          sx={{
            flexGrow: 1,
            padding: '16px', // Padding inside the main content area
          }}
        >
          <Typography variant="h4" gutterBottom>
            Chat
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: '#f5f5f5', // Background for chat area
              padding: '16px',
              borderRadius: '8px', // Optional: round the corners of the chat area
            }}
          >
            <Messages /> {/* Main chat area */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
