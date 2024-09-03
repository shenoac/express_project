import { useSockets } from '../context/SocketContext';
import { useEffect, useRef } from 'react';
import ButtonUsage from '../components/ButtonUsage';
import InputField from '../components/InputField';
import Typography from '@mui/material/Typography'; // Import Typography from Material-UI
import Box from '@mui/material/Box';
function RoomsContainer() {
  const { socket, rooms, setRooms, setCurrentRoom, currentRoom } = useSockets();
  const roomNameRef = useRef<HTMLInputElement>(null);

  const handleCreateRoom = () => {
    const roomName = roomNameRef.current?.value;
    if (roomName) {
      socket.emit('createRoom', roomName);
      roomNameRef.current.value = ''; // Clear the input field after creating the room
    }
  };

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room with ID:', roomId); // Logging the roomId
    socket.emit('joinRoom', roomId);
    setCurrentRoom(roomId);
  };

  useEffect(() => {
    socket.on('rooms', (updatedRooms: { roomId: string; name: string }[]) => {
      setRooms(updatedRooms);
      console.log('Rooms updated:', updatedRooms); // Logging updated rooms list
    });

    return () => {
      socket.off('rooms');
    };
  }, [socket, setRooms]);

  const currentRoomName = rooms.find(room => room.roomId === currentRoom)?.name;

  return (
    <div className="rooms-container">
      {currentRoomName && (
        <Typography variant="h6" gutterBottom>
          Current Room: {currentRoomName}
        </Typography>
      )} 
      <div className="rooms-list" style={{ marginBottom: '25px' }}>
        {rooms.map((room, index) => (
          <Box
            key={index}
            sx={{
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: room.roomId === currentRoom ? '#e0f7fa' : '#f0f0f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#cfd8dc',
              },
              boxShadow: room.roomId === currentRoom ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none',
            }}
            onClick={() => handleJoinRoom(room.roomId)}
          >
            <Typography variant="body1" sx={{ fontWeight: room.roomId === currentRoom ? 'bold' : 'normal' }}>
              <i className="fas fa-door-open" style={{ marginRight: '8px' }}></i>
              {room.name}
            </Typography>
          </Box>
        ))}
      </div>
      <div className="create-room">
        <InputField
          label="Room Name"
          placeholder="Enter room name"
          ref={roomNameRef}
        />
        <ButtonUsage onClick={handleCreateRoom} label="Create Room" />
      </div>
    </div>
  );
}

export default RoomsContainer;
