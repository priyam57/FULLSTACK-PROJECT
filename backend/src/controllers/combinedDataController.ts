import { Request, Response } from "express";
import axios from "axios";

export const getCombinedData = async (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  try {
    const statisticsResponse = await axios.get(
      `http://localhost:3001/api/statistics?month=${month}`
    );
    const barChartResponse = await axios.get(
      `http://localhost:3001/api/bar-chart?month=${month}`
    );
    const pieChartResponse = await axios.get(
      `http://localhost:3001/api/pie-chart?month=${month}`
    );

    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
