import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router, Routes, and Route
import Messages from './containers/Messages';
import Rooms from './containers/Rooms';
import UsernameForm from './components/UsernameForm';
import { useSockets } from './context/SocketContext';
import StateViewer from './components/StateViewer';
import TestPage from './TestPage'; // Import your TestPage component

function App() {
  const { username } = useSockets();

  return (
    <Router>
      <Routes>
        {/* Route for the test page */}
        <Route path="/test" element={<TestPage />} />

        {/* Route for the main chat app */}
        <Route
          path="/"
          element={
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
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
