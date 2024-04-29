import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import { Link, useNavigate } from 'react-router-dom'; 
// import {useNavigate} from 'react-router-dom';


const LoginForm = ({ onLogin }) => {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', username);
    formData.append('password', password);
    
    fetch('http://3.133.156.235/login', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      const email = data.user['email']
      
      onLogin(email)
      navigate('/')
    
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center"> Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-800 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800 font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-gray-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-indigo-200 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-300 transition-colors focus:outline-none focus:bg-indigo-300 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50">Login</button>
          </div>
        </form>
      </div>
      <p className="mt-4 text-black">Not registered? <span className='underline text-indigo-600 font-bold text-xl pl-2'><Link to="/signup">Register here</Link></span></p>
    </div>
  );
};


LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
