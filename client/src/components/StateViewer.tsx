// client/src/components/StateViewer.tsx
import React from 'react';
import { useSockets } from '../context/SocketContext';

function StateViewer() {
  const { currentRoom, rooms, username } = useSockets();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px', zIndex: 1000 }}>
      <h3>State Viewer</h3>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Current Room:</strong> {currentRoom}</p>
      <p><strong>Rooms:</strong> {JSON.stringify(rooms, null, 2)}</p>
    </div>
  );
}

export default StateViewer;
