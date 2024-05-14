import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { supabase } from '../../supabaseClient'; // 请确保这里是正确的导入路径和对象

/**
 * A component for the 3D visualisation of data entries in the database. It visualises the X coordinates, Y coordinates, and timestamp.
 * @param {string} currentStudy - the name of the current study.
 * @param {number} currentParticipant - the ID of the current participant.
 * @returns - a 3D scatter chart of the given data.
 */
const ScatterChart3D = ({ currentStudy, currentParticipant }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    /**
     * Fetches the study data or participant data from the backend, depending on which one is needed.
     */
    const fetchData = async () => {
      let query = supabase
        .from('MoodDataTable')
        .select('ParticipantID, Xcoordinate, Ycoordinate, Timestamp')
        .eq('StudyID', currentStudy);
    
      if (currentParticipant) {
        query = query.eq('ParticipantID', currentParticipant);
      }
    
      const { data: studyData, error } = await query;
    
      if (error) {
        console.error('Error fetching data', error);
        return;
      }
    
      if (!studyData || studyData.length === 0) {
        console.error('No data found for the query');
        return;
      }
    
      console.log('Fetched data:', studyData);
    
      // Ensure data has valid date timestamps and other needed fields
      const filteredData = studyData.filter(item => item.Timestamp && !isNaN(new Date(item.Timestamp).valueOf()));
      if (filteredData.length !== studyData.length) {
        console.error('Some data entries are missing valid timestamps');
      }
    
      const trace = {
        x: filteredData.map(item => item.Xcoordinate),
        y: filteredData.map(item => item.Ycoordinate),
        z: filteredData.map(item => item.Timestamp),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          size: 5,
          opacity: 0.6
        }
      };
      setData([trace]);
    };
    

    fetchData();
  }, [currentStudy, currentParticipant]);

  const layout = {
    autosize: true,
    title: '3D Data Scatter Chart',
    scene: {
      xaxis: { title: 'X Coordinate', range: [-100, 100] },
      yaxis: { title: 'Y Coordinate', range: [-100, 100] },
      zaxis: {
        title: 'Time',
        type: 'date',
        range: ['2024-02-01', '2024-06-01']
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

  return <Plot data={data} layout={layout} style={{ width: '100%', height: '600px' }} />;
};

export default ScatterChart3D;
