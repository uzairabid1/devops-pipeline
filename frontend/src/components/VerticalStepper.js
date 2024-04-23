import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import Link from '@mui/material/Link';
const StyledStepper = styled(Stepper)({
  padding: "20px",
});

const VerticalStepper = ({ stepsData, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [webstatus, setWebstatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarOpened, setSnackbarOpened] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    const fetchData = async () => {
      try {
        const response = await fetch("http://3.133.156.235/stages");
        const data = await response.json();
        const inProgressIndex = data.stages.findIndex((stage) => stage.status === "IN_PROGRESS" || stage.status === "FAILED");
        const totalSteps = stepsData.length;

        // Set active step to the index of the first in-progress step if found, otherwise set it to the last completed step
        setActiveStep(inProgressIndex !== -1 ? inProgressIndex : totalSteps);
        console.log('meow');
        if (inProgressIndex === -1 && data.stages[totalSteps - 1].status === "SUCCESS" && !snackbarOpened) {
          setOpenSnackbar(true);
          setSnackbarOpened(true);
          onComplete();
          setWebstatus(true);
        }
      } catch (error) {
        console.error("Error fetching pipeline status:", error);
      } finally {
        timeoutId = setTimeout(fetchData, 50);
      }
    };

    fetchData();

    return () => clearTimeout(timeoutId); 
  }, [stepsData, onComplete, snackbarOpened]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="flex justify-center items-center flex-col">
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {stepsData.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index >= activeStep && step.status !== "SUCCESS";
          const isInProgress = step.status === "IN_PROGRESS";
          let animationClass = "";

          if (isActive || isInProgress) {
            switch (Math.floor(Math.random() * 3)) {
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
            <Step key={index} completed={isCompleted}>
              <StepLabel>
                <div
                  className={`text-2xl font-bold flex items-center ${
                    isCompleted || isActive || isInProgress ? "text-secondary-200" : "text-secondary-100"
                  }`}
                >
                  <span>{step.label}</span>
                  <span
                    className={`ml-4 ${
                      isCompleted || isActive || isInProgress ? "text-secondary-200" : "text-secondary-100"
                    } ${isActive || isInProgress ? animationClass : ""}`}
                  >
                    <span className={isActive || isInProgress ? "text-secondary-100" : ""}>{React.cloneElement(step.logo, { size: 32 })}</span>
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
      {webstatus && (
        
        <Link href="http://a216f4b8e8f9741eba6c09ff79997c63-1448798318.us-east-2.elb.amazonaws.com:8080/webapp/">your website is deployed</Link>
        )}
    </Box>
  );
};

export default VerticalStepper;
