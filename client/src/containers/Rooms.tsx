import { useSockets } from '../context/SocketContext';
import { useEffect, useRef } from 'react';
import ButtonUsage from '../components/ButtonUsage';
import InputField from '../components/InputField';
import Typography from '@mui/material/Typography'; // Import Typography from Material-UI

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
    socket.emit('joinRoom', roomId);
    setCurrentRoom(roomId);
  };

  useEffect(() => {
    socket.on('rooms', (updatedRooms: { roomId: string; name: string }[]) => {
      setRooms(updatedRooms);
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
      )} {/* Display current room name */}
      <div className="rooms-list"
      style={{ marginBottom: '25px' }}
    >
        {rooms.map((room, index) => (
          <Typography
            variant="body1"
            key={index}
            onClick={() => handleJoinRoom(room.roomId)}
            style={{ cursor: 'pointer', marginBottom: '8px' }} // Added a bit of margin and cursor pointer for better UX
          >
            {room.name}
          </Typography>
        ))}
      </div>
      <div className="create-room">
        <InputField
          label="Room Name"
          placeholder="Enter room name"
          ref={roomNameRef} // Attach ref to the InputField
        />
        <ButtonUsage onClick={handleCreateRoom} label="Create Room" />
      </div>
    </div>
  );
}

export default RoomsContainer;
