import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";

const StyledStepper = styled(Stepper)({
  padding: "20px",
});

const VerticalStepper = ({ stepsData, onComplete, isEnabled }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    let timer;
    const duration = activeStep < stepsData.length ? 3000 : 0;
    const completionTimeout = setTimeout(() => {
      setActiveStep((prevActiveStep) => {
        const nextStep = prevActiveStep + 1;
        if (nextStep === stepsData.length) {
          setOpenSnackbar(true);
          onComplete();
        }
        return nextStep;
      });
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(completionTimeout);
    };
  }, [activeStep, stepsData, onComplete]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <Box className="flex justify-center items-center flex-col">
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {stepsData.map((step, index) => {
          const isActive = index === activeStep;
          const randomAnimationIndex = isActive
            ? Math.floor(Math.random() * 3)
            : -1;
          let animationClass = "";
          if (isActive) {
            switch (randomAnimationIndex) {
              case 0:
                animationClass = "logo-scale";
                break;
              case 1:
                animationClass = "logo-translate";
                break;
              case 2:
                animationClass = "logo-swing";
                break;
              default:
                animationClass = "logo-scale";
            }
          }

          return (
            <Step key={index} completed={index < activeStep}>
              <StepLabel>
                <div
                  className={`text-2xl font-bold flex items-center ${
                    index < activeStep
                      ? "text-secondary-200"
                      : "text-secondary-100"
                  }`}
                >
                  <span>{step.label}</span>
                  <span
                    className={`ml-4 ${
                      index < activeStep
                        ? "text-secondary-200"
                        : "text-secondary-100"
                    } ${isActive ? animationClass : ""}`}
                  >
                    {React.cloneElement(step.logo, { size: 32 })}
                  </span>
                </div>
              </StepLabel>
            </Step>
          );
        })}
      </StyledStepper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          All Tasks Completed!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default VerticalStepper;
