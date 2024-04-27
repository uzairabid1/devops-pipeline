import React, { useState, useEffect } from 'react';

const BuildInfo = ({apiurl}) => {
  const [buildId, setBuildId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiurl);
        console.log(response);
        const data = await response.json();
        console.log(data);
        if (data.stages.build_status === "SUCCESS") {

          setBuildId(data.stages.build_id);
        }
      } catch (error) {
       
      }
    }
    const intervalId = setInterval(fetchData, 50);
    return () => clearInterval(intervalId);
  }, [apiurl]);

  return (
    <div className='mt-5'>
      {buildId && (
        <p className='text-xl text-indigo-500'>Build ID: {buildId}</p>
      )}
    </div>
  );
};

export default BuildInfo;
