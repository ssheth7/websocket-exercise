import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState(undefined);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    socketRef.current.on('join_room', function (data) {
      setChat([
        ...chat,
        { name: 'ChatBot', message: `${data} has joined the chat` }
      ]);
    });
  }, [chat]);

  const userjoin = (name, room) => {
    socketRef.current.emit('join_room', name, room);
    setRoom(room);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    setState({ ...state, [msgEle.name]: msgEle.value });
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
      room: room
    });
    e.preventDefault();
    setState({ message: '', name: state.name });
    msgEle.value = '';
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log</h1>
            <h2>Welcome to {room}</h2>
            <hr></hr>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name="message"
                id="message"
                variant="outlined"
                label="Message"
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            console.log(document.getElementById('username_input').value);
            e.preventDefault();
            const username = document.getElementById('username_input').value;
            const roomname = document.getElementById('room_input').value;
            setState({ name: username });
            userjoin(username, roomname);
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input type="text" id="username_input" />
            </label>
            <br/>
            <label>
              Room Name:
              <br/>
              <input type="text" value="Room 1" id="room_input"/>
            </label>
          </div>
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
