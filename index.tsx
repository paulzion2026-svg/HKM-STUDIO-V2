
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NDIOutput from './components/NDIOutput';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Professional actualization: Detect if this window is meant to be a 
// dedicated NDI Clean Feed output.
const isNDIMode = window.location.search.includes('ndi=true');

root.render(
  <React.StrictMode>
    {isNDIMode ? <NDIOutput /> : <App />}
  </React.StrictMode>
);
