import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Intellilogo from '../assets/IntelliDevops.png';
const SignUpForm = ({onSignUp}) => {
  const [fname, setfName] = useState('');
  const [lname, setlName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const formData = new FormData();
    const email_from_form = document.getElementById('email').value;
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('email', email);
    formData.append('password', password);
    fetch('http://127.0.0.1:5001/signup', {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        
      console.log(data)
        
        onSignUp(email_from_form)
        navigate('/verify')
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
    
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-2/5">
        <img src={Intellilogo} alt="Brand LOGO" className="h-56 h-56  rounded-3xl" />
        <p className='mt-4 text-indigo-600 text-center items-center flex-nowrap '> <Link to='/'>2024 © IntelliDevops </Link></p>
        
      </div>
      <div className="bg-white p-8 rounded-md shadow-md w-2/5 mr-2">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400 tracking-wide">IntelliDeploy - Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-between mb-4">
            <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
              <label htmlFor="name" className="block text-gray-600 font-semibold mb-2"> First Name</label>
              <input
                type="text"
                id="fname"
                value={fname}
                onChange={(e) => setfName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
                required
              />
            </div>
            <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
              <label htmlFor="name" className="block text-gray-600 font-semibold mb-2">Last Name</label>
              <input
                type="text"
                id="lname"
                value={lname}
                onChange={(e) => setlName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
                required
              />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-gray-600 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-gray-600 font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-indigo-200 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-300 transition-colors focus:outline-none focus:bg-indigo-300 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50">Sign Up</button>
          </div>
        </form>
      
        <p className="mt-4 text-black text-center">Already have an account? <span className='underline text-indigo-500 font-bold text-xl pl-2'><Link to="/login">Login here</Link></span></p>
      
      </div>
      
      
    </div>
    

    


</>

  );
};

export default SignUpForm;
