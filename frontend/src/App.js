import React, { useState } from "react";
import VerticalStepper from "./components/VerticalStepper";
import CistepsData from "./components/CIStepper";
import CdstepsData from "./components/CdStepper";

const App = () => {
  const [ciStarted, setCIStarted] = useState(false);
  const [cdStarted, setCDStarted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleStartCI = () => {
    setCIStarted(true);
    setActiveTab(0); // Switch to CI tab when CI starts
  };

  const handleStartCD = () => {
    setCDStarted(true);
    setActiveTab(1); // Switch to CD tab when CD starts
  };

  const handleCIComplete = () => {
    setCIStarted(false); // Reset CI status when completed
  };

  const handleCDComplete = () => {
    setCDStarted(false); // Reset CD status when completed
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
              activeTab === 0 && !cdStarted // Disable CI tab if CD has started
                ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Disable style
                : activeTab === 0
                ? "bg-indigo-500 text-white" // Active CI tab style
                : "bg-gray-200 text-gray-800 hover:bg-indigo-200" // Default CI tab style
            } rounded-tl-lg`}
            onClick={() => handleTabChange(0)}
            disabled={!ciStarted && cdStarted} // Disable CI tab when CD has started
          >
            CI Step
          </button>
          <button
            className={`w-1/2 px-4 py-2 transition duration-300 ease-in-out uppercase font-bold ${
              activeTab === 1 && !ciStarted // Disable CD tab if CI has started
                ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Disable style
                : activeTab === 1
                ? "bg-indigo-500 text-white" // Active CD tab style
                : "bg-gray-200 text-gray-800 hover:bg-indigo-200" // Default CD tab style
            } rounded-tr-lg`}
            onClick={() => handleTabChange(1)}
            disabled={!cdStarted && ciStarted} // Disable CD tab when CI has started
          >
            CD Step
          </button>
        </div>
        {activeTab === 0 && !ciStarted && (
          <StartButton onClick={handleStartCI} />
        )}
        {activeTab === 1 && !cdStarted && (
          <StartButton onClick={handleStartCD} />
        )}
        {activeTab === 0 && ciStarted && (
          <VerticalStepper stepsData={CistepsData} onComplete={handleCIComplete} />
        )}
        {activeTab === 1 && cdStarted && (
          <VerticalStepper stepsData={CdstepsData} onComplete={handleCDComplete} />
        )}
      </div>
    </div>
  );
};

const StartButton = ({ onClick }) => {
  return (
    <div className="flex justify-center items-center text-center">
      <button
        className="mt-20 px-6 py-3 bg-indigo-500 text-white font-bold rounded hover:bg-indigo-600 transition duration-300 ease-in-out"
        onClick={onClick}
      >
        Start
      </button>
    </div>
  );
};

export default App;
