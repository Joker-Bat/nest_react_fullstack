import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import { UserProvider } from './HOC/ContextProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <UserProvider>
        <App />
        <ToastContainer position="top-center" autoClose={3000} />
    </UserProvider>,
    // </React.StrictMode>
);
