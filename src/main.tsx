/** @jsxImportSource react */
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = (globalThis as any).document?.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}