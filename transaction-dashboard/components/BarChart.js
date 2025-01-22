import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import config from '../config';

const BarChartComponent = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/bar-chart`, {
        params: { month: selectedMonth },
      });
      const formattedData = Object.keys(response.data).map((range) => ({
        range,
        count: response.data[range],
      }));
      setData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <div className="bar-chart">
      <h2>Price Range Distribution</h2>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
