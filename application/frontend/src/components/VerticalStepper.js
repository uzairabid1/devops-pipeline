import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";


const StyledStepper = styled(Stepper)({
    padding: "20px",
  });

const stepsData = [
  {
    label: "Select campaign settings",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    duration: 5000, 
  },
  {
    label: "Create an ad group",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
    duration: 3000, 
  },
  {
    label: "Create an ad",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    duration: 5000, 
  },
];

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    let timer;
    const duration = activeStep < stepsData.length ? stepsData[activeStep].duration : 0;

    if (progress < 100 && duration > 0) {
      timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress + (100 / duration) * 1000);
      }, 1000);
    }

    const completionTimeout = setTimeout(() => {
      clearInterval(timer);
      setProgress(0);
      setActiveStep((prevActiveStep) => {
        const nextStep = prevActiveStep + 1;
        if (nextStep === stepsData.length) {
          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
          }, 2000);
        }
        return nextStep;
      });
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimeout);
    };
  }, [activeStep, progress]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {stepsData.map((step, index) => (
          <Step key={index} completed={index < activeStep}>
            <StepLabel>
              <Typography variant="h5">{step.label}</Typography>
              {index === activeStep && (
                <LinearProgress
                  sx={{ mt: 2 }}
                  variant="determinate"
                  value={progress}
                />
              )}
            </StepLabel>
            <StepContent>
              <Typography variant="body1">{step.description}</Typography>
            </StepContent>
          </Step>
        ))}
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
