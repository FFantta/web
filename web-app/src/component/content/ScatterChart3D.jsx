import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { getStudyData } from '../../supabaseClient'; 

const ScatterChart3D = ({ currentStudy, currentParticipant}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let studyData = await getStudyData(currentStudy);
      
      if (currentParticipant) {
        studyData = studyData.filter(item => item.ParticipantID === currentParticipant);
      }
      
      if (studyData && studyData.length > 0) {
        const trace = {
          x: studyData.map(item => item.Xcoordinate),
          y: studyData.map(item => item.Ycoordinate),
          z: studyData.map(item => item.Timestamp),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: 3,
            opacity: 0.6
          }
        };
        setData([trace]);
      }
    };
  
    fetchData();
  }, [currentStudy, currentParticipant]);
  

  const layout = {
    autosize: true,
    title: '3D Scatter Chart',
    scene: {
      xaxis: { title: 'X Axis', range: [-100, 100] },
      yaxis: { title: 'Y Axis', range: [-100, 100] },
      zaxis: { 
        title: 'Time', 
        type: 'date', 
        range: ['2024-02-01', '2024-04-01'] 
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 }
      },
      aspectratio: { x: 1, y: 1, z: 1 },
      aspectmode: 'manual'
    },
  };
  
  

  return <Plot data={data} layout={layout} />;
};

export default ScatterChart3D;