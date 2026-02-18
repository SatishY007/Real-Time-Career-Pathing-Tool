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

/**
 * SkillRadarChart (Client)
 * ------------------------
 * Visualization-only component.
 * It renders a Radar chart comparing `userSkills` vs `targetSkills` using Chart.js.
 */

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillRadarChart = ({ userSkills = [], targetSkills = [], labels = [] }) => {
  // Chart.js data model.
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#0f172a',
          font: { size: 12, weight: '600' }
        }
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      r: {
        angleLines: { display: true, color: 'rgba(15, 23, 42, 0.10)' },
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent',
          showLabelBackdrop: false
        },
        pointLabels: {
          color: '#0f172a',
          font: { size: 12, weight: '600' }
        }
      }
    }
  };

  return <Radar data={data} options={options} style={{ width: '100%', height: '100%' }} />;
};

export default SkillRadarChart;
