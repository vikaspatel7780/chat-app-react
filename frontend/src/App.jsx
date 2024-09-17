import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Initialize socket connection
const socket = io('https://socket-backend-cphg.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { message, timestamp: new Date().toLocaleTimeString() });
      setMessage(''); // Clear input after sending
    }
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleMessageReceive);

    return () => {
      socket.off('receive_message', handleMessageReceive);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[url('./bg-image1.jpg')] bg-cover bg-center">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 text-center font-bold">
        WhatsApp Clone
      </div>

      {/* Chat window */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-lg">
        {messageList.length > 0 ? (
          messageList.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-xs rounded-lg p-2 ${
                  index % 2 === 0
                    ? 'bg-gray-300 text-left'
                    : 'bg-green-500 text-white text-right'
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-gray-500">{msg.timestamp}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
      </div>

      {/* Message input box */}
      <form
        className="bg-white p-4 flex items-center space-x-2"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
