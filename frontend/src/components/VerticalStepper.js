import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import Link from "@mui/material/Link";

const StyledStepper = styled(Stepper)({
  padding: "20px",
});

const VerticalStepper = ({ stepsData, onComplete, apiUrl, message, link }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [webstatus, setWebstatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarShown, setSnackbarShown] = useState(false);

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const inProgressIndex = data.stages.findIndex(
          (stage) => stage.status === "IN_PROGRESS" || stage.status === "FAILED"
        );
        const totalSteps = stepsData.length;

        setActiveStep(inProgressIndex !== -1 ? inProgressIndex : totalSteps);

        if (
          inProgressIndex === -1 &&
          data.stages[totalSteps - 1].status === "SUCCESS" &&
          !snackbarShown
        ) {
          setSnackbarShown(true);
          onComplete();
          setWebstatus(true);
        }
      } catch (error) {
        console.error("Error fetching pipeline status:", error);
      } finally {
        timeoutId = setTimeout(fetchData, 100);
      }
    };

    fetchData();

    return () => clearTimeout(timeoutId);
  }, [stepsData, onComplete, apiUrl, snackbarShown]);

  useEffect(() => {
    if (snackbarShown) {
      setOpenSnackbar(true);
    }
  }, [snackbarShown]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="flex justify-center items-center flex-col">
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {stepsData.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive =
            index >= activeStep && step.status !== "SUCCESS";
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
                    isCompleted || isActive || isInProgress
                      ? "text-secondary-200"
                      : "text-secondary-100"
                  }`}
                >
                  <span>{step.label}</span>
                  <span
                    className={`ml-4 ${
                      isCompleted || isActive || isInProgress
                        ? "text-secondary-200"
                        : "text-secondary-100"
                    } ${isActive || isInProgress ? animationClass : ""}`}
                  >
                    <span
                      className={
                        isActive || isInProgress ? "text-secondary-100" : ""
                      }
                    >
                      {React.cloneElement(step.logo, { size: 32 })}
                    </span>
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
          {message}
        </MuiAlert>
      </Snackbar>
      {webstatus && link && (
        <Link href={link}>your website is deployed</Link>
      )}
    </Box>
  );
};
export default VerticalStepper;
