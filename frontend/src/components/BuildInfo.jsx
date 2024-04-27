import React, { useState, useEffect } from 'react';
import {CiCircleInfo} from "react-icons/ci";
const BuildInfo = ({apiurl}) => {
  const [buildId, setBuildId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiurl);
        const data = await response.json();
        console.log(data.stages);
        if (data.stages.build_status === "SUCCESS") {

          setBuildId(data.stages.build_id);
        }
      } catch (error) {
       
      }
    }
    const intervalId = setInterval(fetchData, 100);
    return () => clearInterval(intervalId);
  }, [apiurl]);

  return (
    <div className='mt-5'>
      {buildId && (
        <p className='text-xl text-indigo-600 text-center text-4xl font-bold text-wider'>
           <span className="px-1 " style={{display:'inline-block'}}> <CiCircleInfo fontSize={20} /> 
        </span> 
          Build ID- 
       
         { buildId}</p>
      )}
    </div>
  );
};

export default BuildInfo;
