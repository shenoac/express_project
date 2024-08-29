import MessagesContainer from './containers/Messages';
import RoomsContainer from './containers/Rooms';
import UsernameForm from './components/UsernameForm';  // New import
import { useSockets } from './context/SocketContext';

function App() {
  const { username } = useSockets();

  return (
    <div className="App">
      <h1>Chat App</h1>
      {!username ? (
        <UsernameForm />
      ) : (
        <>
          <RoomsContainer />
          <MessagesContainer />
        </>
      )}
    </div>
  );
}

export default App;
