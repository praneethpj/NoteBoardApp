import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/document.css';
import { FaArrowLeft, FaArrowRight, FaBoxOpen, FaCopy, FaDownload, FaFile, FaLongArrowAltRight, FaMailBulk, FaPlay, FaShare } from "react-icons/fa";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function TypingDocument() {
  const [textareaValue, setTextareaValue] = useState('');
  const [submenu1Visibility, setSubmenu1Visibility] = useState(false);
  const [subsubmenu1Visibility, setSubsubmenu1Visibility] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    socket.on('updatedText', (message) => {
      if (message && message.length > 0) {
        console.log("updatedTextss " + message);
        setTextareaValue(message);
      }
    });
 
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSubmenu1Visibility(false);
        setSubsubmenu1Visibility(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
 
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);  

  const addValue = (newValue) => {
    socket.emit('sendText', { newValue });
    setTextareaValue(newValue);
  };

  const toggleSubmenu1 = () => {
    setSubmenu1Visibility((prevVisibility) => !prevVisibility);
  };

  const toggleSubsubmenu1 = () => {
    setSubsubmenu1Visibility((prevVisibility) => !prevVisibility);
  };

  return (
    <div>
      <div className="main-title">📝 Note Board App</div>
      <div>
        <ul className="menu" ref={menuRef}>
          <li onClick={toggleSubmenu1}>
            File
            <ul className={`submenu ${submenu1Visibility ? 'visible' : ''}`}>
              <li onMouseEnter={toggleSubsubmenu1}>
                <FaFile/>New  <FaPlay size={8} style={{paddingLeft:'50%'}}/>
                <ul className={`subsubmenu ${subsubmenu1Visibility ? 'visible' : ''}`}>
                  <li>Document</li>
                  <li>From template from gallery</li>
                </ul>
              </li>
              <li> <FaBoxOpen/> Open </li>
              <li class="menu-item menu-separator"><FaCopy/> Make a Copy</li>
              <li class="menu-item "><FaShare/>Share</li>
              <li class="menu-item "><FaMailBulk/>Email</li>
              <li class="menu-item menu-separator"><FaDownload/>Download</li>
              <li class="menu-item"><FaCopy/> Rename</li>
            </ul>
          </li>
          
       
            <li class="menu-item">Menu Item 3</li>
        </ul>
      </div>
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
