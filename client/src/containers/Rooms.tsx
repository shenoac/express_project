import { useState, useRef, useEffect } from 'react';
import { useSockets } from '../context/SocketContext';

function RoomsContainer() {
  const { socket } = useSockets();
  const [rooms, setRooms] = useState<string[]>([]);
  const roomNameRef = useRef<HTMLInputElement>(null);

  const handleCreateRoom = () => {
    const roomName = roomNameRef.current?.value;
    if (roomName) {
      socket.emit("createRoom", roomName);
      roomNameRef.current.value = "";
    }
  };


  useEffect(() => {
    socket.on("rooms", (updatedRooms: string[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      socket.off("rooms");
    };
  }, [socket]);

  return (
    <div className="rooms-container">
      <h2>Rooms</h2>
      <div className="rooms-list">
        {rooms.map((room, index) => (
          <p key={index}>{room}</p>
        ))}
      </div>
      <div className="create-room">
        <input ref={roomNameRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
    </div>
  );
}

export default RoomsContainer;
