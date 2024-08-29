import { useState } from 'react';
import { useSockets } from '../context/SocketContext';

function UsernameForm() {
  const { setUsername }  = useSockets();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="username-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter your username"
      />
      <button type="submit">Set Username</button>
    </form>
  );
}

export default UsernameForm;
