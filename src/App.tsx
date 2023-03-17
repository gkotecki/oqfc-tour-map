import React from 'react';
import ReactDOM from 'react-dom/client';
import { TourMap } from './components/TourMap';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TourMap />
  </React.StrictMode>,
);
