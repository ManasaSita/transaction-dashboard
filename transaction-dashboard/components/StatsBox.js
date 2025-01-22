import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({ totalSales: 0, soldItems: 0, notSoldItems: 0 });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/statistics`, {
        params: { month: selectedMonth },
      });
      setStatistics(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="statistics-box">
      <h2>Statistics</h2>
      <div>Total Sales: ${statistics.totalSales}</div>
      <div>Sold Items: {statistics.soldItems}</div>
      <div>Unsold Items: {statistics.notSoldItems}</div>
    </div>
  );
};

export default StatisticsBox;
