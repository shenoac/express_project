import { useEffect, useState, useRef } from 'react';
import { useSockets } from '../context/SocketContext';

function RoomsContainer() {
  const { socket, rooms, setRooms } = useSockets();
  const roomNameRef = useRef<HTMLInputElement>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const handleCreateRoom = () => {
    const roomName = roomNameRef.current?.value;
    if (roomName) {
      socket.emit('createRoom', roomName);
      roomNameRef.current.value = '';
    }
  };

  const handleJoinRoom = (roomName: string) => {
    if (currentRoom) {
      socket.emit('leaveRoom', currentRoom);
    }
    socket.emit('joinRoom', roomName);
    setCurrentRoom(roomName);
  };

  useEffect(() => {
    socket.on('rooms', (updatedRooms: string[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off('rooms');
    };
  }, [socket, setRooms]);

  return (
    <div className="rooms-container">
      <h2>Rooms</h2>
      <div className="rooms-list">
        {rooms.map((room, index) => (
          <p key={index} onClick={() => handleJoinRoom(room)}>
            {room}
          </p>
        ))}
      </div>
      <div className="create-room">
        <input ref={roomNameRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      {currentRoom && <p>Current Room: {currentRoom}</p>}
    </div>
  );
}

export default RoomsContainer;
