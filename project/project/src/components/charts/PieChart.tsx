import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartData } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ChartData;
  title?: string;
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, className }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: !!title,
        text: title || '',
      },
    },
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className || ''}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <div className="w-full">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;