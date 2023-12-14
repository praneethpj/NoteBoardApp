import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/document.css'

const socket = io(process.env.REACT_APP_SOCKET_URL);

function TypingDocument() {
 
  const [textareaValue, setTextareaValue] = useState('');
 
  useEffect(() => {
    socket.on('updatedText', (message) => {
      if (message && message.length > 0) {
        console.log("updatedTextss "+message);
        setTextareaValue(message);
      }
    });
  });

 

  const addValue = (newValue) => {
    socket.emit('sendText', {   newValue });
    setTextareaValue( newValue);
  };
  
  return (
    <div> 
    <div className="main-title">📝 Note Board App</div>
    <div></div>
    <div className="app-container">
    <textarea
      className="full-width-height"
      value={textareaValue}
      onChange={(event) => {
        addValue(event.target.value);
      }}
    />
  </div>
     
   
    </div>
  );
}

export default TypingDocument;