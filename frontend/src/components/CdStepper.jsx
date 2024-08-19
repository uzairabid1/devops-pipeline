
import React from 'react';
import { FaGithub } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { MdCleaningServices } from "react-icons/md";
import { GoRepoPush } from "react-icons/go";
import { FaSlack } from 'react-icons/fa';
const CdstepsData = [
  {
    label: "Checkout SCM",
    logo: <FaGithub />
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
    label: "Update the Deployment Tags",
    logo: <GrUpdate />
  },
  {
    label: "Push changes to the Repo",
    logo: <GoRepoPush />
  },
  {
    label: "Send Slack Notification",
    logo: <FaSlack/>
  }
];

export default CdstepsData;