import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/document.css';
import {
  FaBoxOpen,
  FaCopy,
  FaDownload,
  FaExchangeAlt,
  FaFile,
  FaMailBulk,
  FaPaste,
  FaPlay,
  FaTrash,
  FaVestPatches,
} from 'react-icons/fa';

const socket = io(process.env.REACT_APP_SOCKET_URL);

const submenuData = [
  
  {
    label: 'New',
    icon: <FaFile />,
    actionIcon: <FaPlay size={8} style={{ paddingLeft: '60%' }} />,
    subsubmenu: [
      { label: 'Document' },
      { label: 'From template from gallery' },
    ],
  },
  { label: 'Open', icon: <FaBoxOpen /> },
  { label: 'Make a Copy', icon: <FaCopy />, separator: true },
  {
    label: 'Share',
    icon: <FaFile />,
    actionIcon: <FaPlay size={8} style={{ paddingLeft: '60%' }} />,
    subsubmenu: [
      { label: 'Comput' },
      { label: 'From template from gallery' },
    ],
  },
  { label: 'Email', icon: <FaMailBulk /> },
  { label: 'Download', icon: <FaDownload />, separator: true },
  { label: 'Rename', icon: <FaExchangeAlt /> },
  { label: 'Move', icon: <FaPaste /> },
  { label: 'Add Shortcut to Driver', icon: <FaVestPatches /> },
  { label: 'Move to Trash', icon: <FaTrash /> },
  
];

function TypingDocument() {
  const [textareaValue, setTextareaValue] = useState('');
  const [submenuVisibility, setSubmenuVisibility] = useState(false);
  const [currentSubMenu, setCurrentSubMenu] = useState(null);
 
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
 

  const menuRef = useRef(null);

  useEffect(() => {
    socket.on('updatedText', (message) => {
      if (message && message.length > 0) {
        console.log('updatedTextss ' + message);
        setTextareaValue(message);
      }
    });

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && submenuVisibility) {
        setSubmenuVisibility(false);
        setCurrentSubMenu(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [submenuVisibility]);

  const addValue = (newValue) => {
    socket.emit('sendText', { newValue });
    setTextareaValue(newValue);
  };
 
  const toggleSubmenu = (submenuIndex) => {
    setSubmenuVisibility((prevVisibility) => (currentSubMenu === submenuIndex ? !prevVisibility : true));
    setCurrentSubMenu(submenuIndex);
  };

  return (
    <div>
      <div className="main-title">📝 Note Board App</div>
      <div>
        <ul className="menu" ref={menuRef}>
          <li onClick={() => toggleSubmenu(null)}>
            File
            <ul className={`submenu ${submenuVisibility ? 'visible' : ''}`}>
              {submenuData.map((submenu, index) => (
                <li key={index} onMouseEnter={() => toggleSubmenu(index)}>
                  {submenu.icon}
                  {submenu.label}
                  {submenu.actionIcon && submenu.actionIcon}
                  {submenu.subsubmenu && (
                    <ul className={`subsubmenu ${currentSubMenu === index ? 'visible' : ''}`}>
                      {submenu.subsubmenu.map((subsubmenu, subIndex) => (
                        <li key={subIndex}>{subsubmenu.label}</li>
                      ))}
                    </ul>
                  )}
                  {submenu.separator && <hr />}
                </li>
              ))}
            </ul>
          </li>
   
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
