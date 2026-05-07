import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Router from './router';
import { AppDispatch, store } from './store';
import { fetchCurrentUser, forceLogout } from './store/slices/authSlice';

function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const handleUnauthorized = () => {
      dispatch(forceLogout());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return null;
}

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
      <AuthBootstrap />
      <Router />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default App;
