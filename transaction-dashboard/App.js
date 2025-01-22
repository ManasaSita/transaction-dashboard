import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState("March"); // Default month

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="app-container">
      <h1>Transaction Dashboard</h1>
      <div className="month-selector">
        <label htmlFor="month">Select Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <TransactionsTable selectedMonth={selectedMonth} />
      <StatisticsBox selectedMonth={selectedMonth} />
      <BarChartComponent selectedMonth={selectedMonth} />
      <PieChartComponent selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
