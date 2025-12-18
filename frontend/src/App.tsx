import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Router from './router';
import { store } from './store';

function App() {
  useEffect(() => {
    // Check backend health when component mounts
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        console.log(`Backend status: ${data.status} - ${data.message}`);
      })
      .catch(error => {
        console.error('Error fetching backend health:', error);
      });
  }, []);

  return (
    <Provider store={store}>
      <Router />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default App;
