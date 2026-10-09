import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadPages } from './App';
import { AnnouncementsProvider } from './context/AnnouncementsContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeModeProvider } from './context/ThemeModeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <AuthProvider>
          <AnnouncementsProvider>
            <StoreProvider>
              <App />
            </StoreProvider>
          </AnnouncementsProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

if ('requestIdleCallback' in window) window.requestIdleCallback(preloadPages);
else setTimeout(preloadPages, 1500);
