import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Intellilogo from '../assets/IntelliDevops.png';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
const OTPForm = ({ Signupemail }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('otp', otp);
    const query_email = Signupemail;
    fetch(`http://127.0.0.1:5001/verify?email=${query_email}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/login');
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleKeyPress = (e) => {
    const pattern = /^[0-9\b]+$/;
    if (!pattern.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center w-2/5 h-64">
          <img src={Intellilogo} alt="Brand LOGO" className="h-56 rounded-3xl" />
          <p className="mt-4 text-indigo-600 text-center items-center flex-nowrap ">
            {' '}
            <Link to="/">2024 © IntelliDevops </Link>
          </p>
        </div>
        <div className="bg-white p-8 rounded-md shadow-md w-2/5 mr-2 h-96">
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400 tracking-wide">Verify your OTP </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-20">
              <label htmlFor="otp" className="block text-gray-600 font-semibold mb-2">
                Enter your Verification Code
              </label>
              <input
                type="tel"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-400 text-indigo-800"
                required
                maxLength={4}
                onKeyPress={handleKeyPress}
                pattern="[0-9]*" 
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-200 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-300 transition-colors focus:outline-none focus:bg-indigo-300 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


OTPForm.propTypes = {
  Signupemail: PropTypes.string,
};

export default OTPForm;
