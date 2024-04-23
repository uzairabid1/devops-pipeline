import React from 'react';
import { FaGithub } from "react-icons/fa";
import { GrInstallOption } from "react-icons/gr";
import { MdCleaningServices } from "react-icons/md";
import { MdOutlineBuildCircle } from "react-icons/md";
import { MdOutlineChecklist } from "react-icons/md";
import { SiSonarqube, SiTrivy } from "react-icons/si";
import { BsExclamationOctagon } from "react-icons/bs";
import { LiaDocker } from "react-icons/lia";
import { SiGithubactions } from "react-icons/si";

const CistepsData = [
  {
    label: "Checkout SCM (Github Repo)",
    logo: <FaGithub />
  },
  {
    label: "Tool Install",
    logo: <GrInstallOption />
  },
  {
    label: "Cleanup Workspace",
    logo: <MdCleaningServices />
  },
  {
    label: "Checkout from SCM again",
    logo: <FaGithub />
  },
  {
    label: "Build Application",
    logo: <MdOutlineBuildCircle />
  },
  {
    label: "Test Application",
    logo: <MdOutlineChecklist />
  },
  {
    label: "SonarQube Analysis",
    logo: <SiSonarqube />
  },
  {
    label: "Quality Gate",
    logo: <BsExclamationOctagon />
  },
  {
    label: "Build and push Docker Image",
    logo: <LiaDocker />
  },
  {
    label: "Trivy Scan",
    logo: <SiTrivy />
  },
  {
    label: "Cleanup Artifacts",
    logo: <MdCleaningServices />
  },
  {
    label: "Trigger CD Pipeline",
    logo: <SiGithubactions />
  }
];

export default CistepsData;
