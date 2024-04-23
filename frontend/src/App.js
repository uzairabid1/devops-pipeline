// App.js
import React, { useState } from "react";
import VerticalStepper from "./components/VerticalStepper";
import CistepsData from "./components/CIStepper";
import CdstepsData from "./components/CdStepper";

const App = () => {
  const [ciCompletedSteps, setCICompletedSteps] = useState([]);
  const [cdCompletedSteps, setCDCompletedSteps] = useState([]);
  const [ciVisible, setCiVisible] = useState(true); // State to track CI stepper visibility
  const [cdVisible, setCdVisible] = useState(false); // State to track CD stepper visibility

  const handleToggleCI = () => {
    setCiVisible(true);
    setCdVisible(false);
  };

  const handleToggleCD = () => {
    setCiVisible(false);
    setCdVisible(true);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 mb-20">
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
        {ciVisible && (
          <VerticalStepper
            stepsData={CistepsData}
            onComplete={(completedStep) => {
              setCICompletedSteps((prevCompletedSteps) => [...prevCompletedSteps, completedStep]);
            }}
            completedSteps={ciCompletedSteps}
          />
        )}
        {cdVisible && (
          <VerticalStepper
            stepsData={CdstepsData}
            onComplete={(completedStep) => {
              setCDCompletedSteps((prevCompletedSteps) => [...prevCompletedSteps, completedStep]);
            }}
            completedSteps={cdCompletedSteps}
          />
        )}
      </div>
    </div>
  );
};

export default App;
