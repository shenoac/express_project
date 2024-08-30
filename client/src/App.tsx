import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Messages from './containers/Messages';
import Rooms from './containers/Rooms';
import UsernameForm from './components/UsernameForm';
import { useSockets } from './context/SocketContext';
import StateViewer from './components/StateViewer';
import TestPage from './TestPage';
import Typography from '@mui/material/Typography'; 

function App() {
  const { username } = useSockets();

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Router>
        <Routes>
          {/* Route for the test page */}
          <Route path="/test" element={<TestPage />} />

          {/* Route for the main chat app */}
          <Route
            path="/"
            element={
              <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Typography variant="h3" align="center" gutterBottom>
                  Chat!
                </Typography>
                {!username ? (
                  <UsernameForm />
                ) : (
                  <div style={{ display: 'flex', flex: 1 }}>
                    <div style={{
                      flex: '0 0 250px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      margin: '10px',
                      padding: '10px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      overflowY: 'auto'
                    }}>
                      <Rooms />
                    </div>
                    <div style={{
                      flex: 1,
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      margin: '10px',
                      padding: '10px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      overflowY: 'auto'
                    }}>
                      <Messages />
                    </div>
                  </div>
                )}
                <StateViewer />
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
