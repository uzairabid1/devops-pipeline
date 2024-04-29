import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerticalStepper from "./components/VerticalStepper";
import CistepsData from "./components/CIStepper";
import CdstepsData from "./components/CdStepper";
import BuildInfo from "./components/BuildInfo";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignupForm";
import OTPForm from "./components/OTPForm";
import Navbar from "./components/Navbar";

const App = () => {
  const [ciCompletedSteps, setCICompletedSteps] = useState([]);
  const [cdCompletedSteps, setCDCompletedSteps] = useState([]);
  const [Signupemail, setSignupemail] = useState('');
  const [loggedInName, setLoggedInName] = useState('');
  const [cdVisible, setCdVisible] = useState(false);
  const [ciVisible, setCiVisible] = useState(true);

  const handleToggleCI = () => {
    setCiVisible(true);
    setCdVisible(false);
  };

  const handleToggleCD = () => {
    setCiVisible(false);
    setCdVisible(true);
  };
  const handleLogin = (data) => {
    console.log(data)
    setLoggedInName(data);
  };
  const handleSignup = (data) => {
    console.log(data)
    setSignupemail(data);
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
            <Navbar loggedInName={loggedInName}/>
              
         <div className=" flex flex-col items-center justify-center mt-20 mb-20">
      <h1 className="text-secondary-200 mb-10 text-4xl tracking-wide font-bold">
        Pipeline Stages
      </h1>
      <div className="w-full max-w-xl">
        <div className="flex">
          <button
            className={`w-1/2 px-1 py-2 transition duration-300 ease-in-out uppercase font-bold ${
              ciVisible
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-indigo-200"
            } rounded-tl-lg`}
            onClick={handleToggleCI}
          >
            CI Step
          </button>
          
          <button
            className={`w-1/2 px-4 py-2 transition duration-300 ease-in-out uppercase font-bold ${
              cdVisible
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-indigo-200"
            } rounded-tr-lg`}
            onClick={handleToggleCD}
          >
            CD Step
          </button>
        </div>
        <div style={{ display: ciVisible ? 'block' : 'none' }}>
        <BuildInfo apiurl="http://3.133.156.235/ci_stages"/>
        
          <VerticalStepper
            stepsData={CistepsData}
            onComplete={(completedStep) => {
              setCICompletedSteps((prevCompletedSteps) => [...prevCompletedSteps, completedStep]);
            }}
            apiUrl="http://3.133.156.235/ci_stages" 
            message = "CI messages Completed"
          />
          
        </div>
        <div style={{ display: cdVisible ? 'block' : 'none' }}>
          <BuildInfo apiurl="http://3.133.156.235/cd_stages"/>

          <VerticalStepper
            stepsData={CdstepsData}
            onComplete={(completedStep) => {
               setCDCompletedSteps((prevCompletedSteps) => [...prevCompletedSteps, completedStep]);
            }}
            apiUrl="http://3.133.156.235/cd_stages" 
            message ="CD Stages Completed"
            link="http://a216f4b8e8f9741eba6c09ff79997c63-1448798318.us-east-2.elb.amazonaws.com:8080/webapp/"
          /> 
        </div>
      </div>
    </div>
        
            </>
          }
        />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path ="/signup" element={<SignUpForm onSignUp={handleSignup}/>} />
        <Route path="/verify" element={<OTPForm Signupemail={Signupemail}/>} />
      </Routes>
    </Router>
  );
};

export default App;
