import './index.scss';

import ReactDOM from 'react-dom/client';

import App from './App';

// React.StrictMode doesn't play well with epubjs's use of iframes.
ReactDOM.createRoot(document.querySelector('#root')!).render(<App />);
