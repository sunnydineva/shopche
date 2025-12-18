import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to home page
      </Link>
    </div>
  );
};

export default NotFoundPage;