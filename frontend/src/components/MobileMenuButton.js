import React, { useState, useEffect } from 'react';

const MobileMenuButton = ({ onToggle, isOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <button
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1001,
        background: '#03045E',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        width: 44,
        height: 44
      }}
      onClick={onToggle}
    >
      {isOpen ? '×' : '☰'}
    </button>
  );
};

export default MobileMenuButton;