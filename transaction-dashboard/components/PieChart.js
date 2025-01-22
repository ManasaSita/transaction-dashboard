import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import config from '../config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/pie-chart`, {
        params: { month: selectedMonth },
      });
      const formattedData = Object.keys(response.data).map((category) => ({
        name: category,
        value: response.data[category],
      }));
      setData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  return (
    <div className="pie-chart">
      <h2>Category Distribution</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
