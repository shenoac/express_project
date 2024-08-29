import MessagesContainer from './containers/Messages';
import RoomsContainer from './containers/Rooms';

function App() {
  return (
    <div className="App">
      <h1>Chat App</h1>
      <RoomsContainer />
      <MessagesContainer />
    </div>
  );
}

export default App;
