import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './SidebarToggle.css';

function SidebarToggle({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
      {isOpen ? <FiX className="toggle-icon" /> : <FiMenu className="toggle-icon" />}
    </div>
  );
}

export default SidebarToggle;
