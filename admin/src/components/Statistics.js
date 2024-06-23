import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/statistics`, {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="statistics-container">
      <h3>Statistics for {month}</h3>
      <div className="statistics-item">
        Total Sale Amount: <span>{statistics.totalSales}</span>
      </div>
      <div className="statistics-item">
        Total Sold Items: <span>{statistics.soldItems}</span>
      </div>
      <div className="statistics-item">
        Total Not Sold Items: <span>{statistics.notSoldItems}</span>
      </div>
    </div>
  );
};

export default Statistics;
