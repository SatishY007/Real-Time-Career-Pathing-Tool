import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillRadarChart = ({ userSkills = [], targetSkills = [], labels = [] }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'My Skills',
        data: userSkills,
        backgroundColor: 'rgba(58, 141, 222, 0.2)',
        borderColor: 'rgba(58, 141, 222, 1)',
        pointBackgroundColor: 'rgba(58, 141, 222, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(58, 141, 222, 1)',
      },
      {
        label: 'Target Role',
        data: targetSkills,
        backgroundColor: 'rgba(255, 168, 0, 0.2)',
        borderColor: 'rgba(255, 168, 0, 1)',
        pointBackgroundColor: 'rgba(255, 168, 0, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 168, 0, 1)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 }
        }
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          font: { size: 14 }
        }
      }
    }
  };

  return <Radar data={data} options={options} />;
};

export default SkillRadarChart;
