import React, { useState, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { supabase } from '../../supabaseClient'; 
import './scatterChartStyle.css';

const ScatterChart = ({ currentStudy, currentParticipant }) => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
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
        name: `${d.Tag} (Participant ${d.ParticipantID})`
      }));

      setChartData(formattedData);
    };

    fetchData();
  }, [currentStudy, currentParticipant]);

  const options = {
    autoSize: true,
    title: { text: 'Participant Coordinates' },
    series: [
      {
        type: 'scatter',
        data: chartData,
        xKey: 'x',
        yKey: 'y',
        labelKey: 'name',
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
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Y Coordinate' },
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

  return <AgChartsReact options={options} />;
};

export default ScatterChart;
