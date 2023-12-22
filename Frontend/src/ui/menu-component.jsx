import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/document.css';
import {
  FaBook,
  FaBoxOpen,
  FaCopy,
  FaCut,
  FaDownload,
  FaExchangeAlt,
  FaFile,
  FaIntercom,
  FaMailBulk,
  FaPaintBrush,
  FaPaste,
  FaPlay,
  FaRedo,
  FaShare,
  FaTrash,
  FaUndo,
  FaVestPatches,
} from 'react-icons/fa';

 

const menuData = {
  File: [
    {
      label: 'New',
      icon: <FaFile />,
      actionIcon: <FaPlay size={8} style={{ paddingLeft: '60%' }} />,
      subsubmenu: [
        { label: 'Document', icon: <FaBook color='blue !important' /> },
        { label: 'From template from gallery',icon:<FaPaintBrush/>},
      ],
    },
    { label: 'Open', icon: <FaBoxOpen /> },
    { label: 'Make a Copy', icon: <FaCopy />, separator: true },
    {
      label: 'Share',
      icon: <FaFile />,
      actionIcon: <FaPlay size={8} style={{ paddingLeft: '60%' }} />,
      subsubmenu: [
        { label: 'Share with Others' ,   icon: <FaShare />},
        { label: 'Publish to Web' ,   icon: <FaIntercom />},
      ],
    },
    { label: 'Email', icon: <FaMailBulk /> },
    { label: 'Download', icon: <FaDownload />, separator: true },
    { label: 'Rename', icon: <FaExchangeAlt /> },
    { label: 'Move', icon: <FaPaste /> },
    { label: 'Add Shortcut to Driver', icon: <FaVestPatches /> },
    { label: 'Move to Trash', icon: <FaTrash /> },
  ],
  Edit: [
    { label: 'Undo', icon: <FaUndo /> },
    { label: 'Redo', icon: <FaRedo /> , separator: true},
    { label: 'Copy', icon: <FaCopy /> },
    { label: 'Cut', icon: <FaCut /> },
  ],
};

function MenuComponent() {
 
  const [submenuVisibility, setSubmenuVisibility] = useState(new Array(Object.keys(menuData).length).fill(false));
  const [currentSubMenu, setCurrentSubMenu] = useState(null);
  const [currentSubSubmenu, setCurrentSubSubmenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
  

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && submenuVisibility.some((visible) => visible)) {
        setSubmenuVisibility(new Array(Object.keys(menuData).length).fill(false));
        setCurrentSubMenu(null);
        setCurrentSubSubmenu(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [submenuVisibility]);

 

  const handleMenuClick = (menuIndex) => {
    setSubmenuVisibility((prevVisibility) =>
      prevVisibility.map((_, index) => (menuIndex === index ? !prevVisibility[index] : false))
    );

    setCurrentSubMenu((prevSubMenu) => (menuIndex === prevSubMenu ? null : menuIndex));
 
    setSubmenuVisibility((prevVisibility) =>
      prevVisibility.map((_, index) => (menuIndex !== index ? false : prevVisibility[index]))
    );
  };

  const handleSubmenuMouseEnter = (submenuIndex) => {
    setCurrentSubSubmenu(submenuIndex);
  };

  const handleSubmenuMouseLeave = () => {
    setCurrentSubSubmenu(null);
  };

  return (
  
        <ul className="menu" ref={menuRef}>
          {Object.entries(menuData).map(([menuLabel, submenuItems], menuIndex) => (
            <li key={menuIndex} onClick={() => handleMenuClick(menuIndex)}>
              {menuLabel}
              <ul className={`submenu ${submenuVisibility[menuIndex] ? 'visible' : ''}`}>
                {submenuItems.map((submenu, submenuIndex) => (
                  <li
                    key={submenuIndex}
                    onMouseEnter={() => handleSubmenuMouseEnter(submenuIndex)}
                    onMouseLeave={handleSubmenuMouseLeave}
                  >
                    {submenu.icon}
                    {submenu.label}
                    {submenu.actionIcon && submenu.actionIcon}
                    {submenu.subsubmenu && (
                      <ul
                        className={`subsubmenu ${
                          menuIndex === currentSubMenu && currentSubSubmenu === submenuIndex ? 'visible' : ''
                        }`}
                      >
                        {submenu.subsubmenu.map((subsubmenu, subIndex) => (
                          <li key={subIndex}>{subsubmenu.icon}{subsubmenu.label}</li>
                        ))}
                      </ul>
                    )}
                    {submenu.separator && <hr />}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
     
  );
}

export default MenuComponent;
