import { useSockets } from '../context/SocketContext';
import { useEffect, useRef } from 'react';
import ButtonUsage from '../components/ButtonUsage';
import InputField from '../components/InputField';

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
      <div className="rooms-list">
        {rooms.map((room, index) => (
          <p key={index} onClick={() => handleJoinRoom(room.roomId)}>
            {room.name} 
          </p>
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
      {currentRoomName && <p>Current Room: {currentRoomName}</p>} {/* Display current room name */}
    </div>
  );
}

export default RoomsContainer;
