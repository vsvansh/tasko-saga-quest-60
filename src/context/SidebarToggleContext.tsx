
import React, { createContext, useState, useContext } from 'react';

interface SidebarToggleContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarToggleContext = createContext<SidebarToggleContextType>({
  isOpen: true,
  toggle: () => {},
  open: () => {},
  close: () => {}
});

export const useSidebarToggle = () => useContext(SidebarToggleContext);

const SidebarToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  
  return (
    <SidebarToggleContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarToggleContext.Provider>
  );
};

export default SidebarToggleProvider;
