import { useSockets } from '../context/SocketContext';
import { useEffect, useRef } from 'react';

function RoomsContainer() {
  const { socket, rooms, setRooms, setCurrentRoom, currentRoom } = useSockets();
  const roomNameRef = useRef<HTMLInputElement>(null);

  const handleCreateRoom = () => {
    const roomName = roomNameRef.current?.value;
    if (roomName) {
      socket.emit('createRoom', roomName);
      roomNameRef.current.value = '';
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
      <h2>Rooms</h2>
      <div className="rooms-list">
        {rooms.map((room, index) => (
          <p key={index} onClick={() => handleJoinRoom(room.roomId)}>
            {room.name} 
          </p>
        ))}
      </div>
      <div className="create-room">
        <input ref={roomNameRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      {currentRoomName && <p>Current Room: {currentRoomName}</p>} {/* Display current room name */}
    </div>
  );
}

export default RoomsContainer;
