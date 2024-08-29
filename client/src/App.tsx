import Messages from './containers/Messages';
import Rooms from './containers/Rooms';
import UsernameForm from './components/UsernameForm';  // New import
import { useSockets } from './context/SocketContext';
import React from 'react';
import StateViewer from './components/StateViewer'; 

function App() {
  const { username } = useSockets();

  return (
    <div className="App">
      <h1>Chat App</h1>
      {!username ? (
        <UsernameForm />
      ) : (
        <>
          <Rooms />
          <Messages />
        </>
      )}
      <StateViewer />
    </div>
  );
}

export default App;
