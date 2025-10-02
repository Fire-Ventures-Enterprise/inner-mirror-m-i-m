import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    const win = globalThis as any;
    if (win.history) {
      win.history.pushState({}, '', page === 'landing' ? '/' : `/${page}`);
    }
  };

  // Handle browser back/forward
  React.useEffect(() => {
    const win = globalThis as any;
    if (win.addEventListener) {
      const handlePopState = () => {
        const path = win.location?.pathname || '/';
        if (path === '/chat') {
          setCurrentPage('chat');
        } else {
          setCurrentPage('landing');
        }
      };

      win.addEventListener('popstate', handlePopState);
      
      // Set initial page based on URL
      handlePopState();
      
      return () => win.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Make navigateTo available globally for navigation
  const win = globalThis as any;
  win.navigateTo = navigateTo;

  return (
    <>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'chat' && <ChatPage />}
    </>
  );
}

export default App;