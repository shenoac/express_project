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
          <Typography
            variant="body1"
            key={index}
            onClick={() => {
              console.log(`Room clicked: ${room.name}, ID: ${room.roomId}`);
              handleJoinRoom(room.roomId);
            }}
            style={{ cursor: 'pointer', marginBottom: '8px' }}
          >
            {room.name}
          </Typography>
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
