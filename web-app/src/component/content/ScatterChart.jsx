import React, { useState, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { supabase } from '../../supabaseClient'; 
import './scatterChartStyle.css';

/**
 * A component for the 2D visualisation of data entries in the database. It visualises the X coordiantes and Y coordinates.
 * @param {string} currentStudy - the name of the current study.
 * @param {number} currentParticipant - the ID of the current participant. 
 * @returns - a 2D scatter chart of the given data.
 */
const ScatterChart = ({ currentStudy, currentParticipant }) => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    /**
     * Fetches the study data or participant data from the backend, depending on which one is needed.
     */
    const fetchData = async () => {
      if (!currentStudy || currentStudy === 'No Study Selected') {
        setChartData([]);
        return;
      }

      let query = supabase
        .from('MoodDataTable')
        .select('ParticipantID, Xcoordinate, Ycoordinate, Tag')
        .eq('StudyID', currentStudy);

      if (currentParticipant) {
        query = query.eq('ParticipantID', currentParticipant);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching data', error);
        setError(error);
        return;
      }

      const formattedData = data.map(d => ({
        x: parseFloat(d.Xcoordinate),
        y: parseFloat(d.Ycoordinate),
        tag: `${d.Tag} (Participant ${d.ParticipantID})`
      }));

      setChartData(formattedData);
    };

    fetchData();
  }, [currentStudy, currentParticipant]);

  const options = {
    autoSize: true,
    title: { text: '2D Data Scatter Chart' },
    series: [
      {
        type: 'scatter',
        data: chartData,
        xKey: 'x',
        yKey: 'y',
        labelKey: 'tag',
        marker: {
          size: 8,
          fill: '#0050b3',
          stroke: '#0040a0',
        },
      },
    ],
    axes: [
      {
        type: 'number',
        position: 'bottom',
        title: { text: 'X Coordinate' },
        min: -100,
        max: 100,
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Y Coordinate' },
        min: -100,
        max: 100,
      },
    ],
    legend: { enabled: false },
    padding: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 20,
    },
  };

  if (error) {
    return <div>Error loading chart: {error.message}</div>; 
  }

  return <AgChartsReact options={options} style={{ width: '100%', height: '500px' }} />;
};

export default ScatterChart;
