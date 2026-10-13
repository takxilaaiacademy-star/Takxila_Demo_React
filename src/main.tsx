import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadPages } from './App';
import { StoreProvider } from './context/StoreContext';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { store } from './store';
import { guardDomForTranslation } from './utils/siteTranslate';

// The site can be translated live into the learner's language; keep React steady while that happens.
guardDomForTranslation();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeModeProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </ThemeModeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

if ('requestIdleCallback' in window) window.requestIdleCallback(preloadPages);
else setTimeout(preloadPages, 1500);
