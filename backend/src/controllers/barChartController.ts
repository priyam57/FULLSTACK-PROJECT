import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Transaction from "../entities/Transaction";

export const getBarChartData = async (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  const monthNumber = new Date(`${month} 01, 2020`).getMonth() + 1;

  try {
    const ranges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const barChartData = await Promise.all(
      ranges.map(async (range) => {
        const count = await getRepository(Transaction)
          .createQueryBuilder("transaction")
          .where(
            `EXTRACT(MONTH FROM to_date(transaction.date_of_sale, 'YYYY-MM-DD')) = :month`,
            { month: monthNumber }
          )
          .andWhere("transaction.price >= :min", { min: range.min })
          .andWhere(
            range.max === Infinity
              ? "transaction.price > :min"
              : "transaction.price <= :max",
            { max: range.max, min: range.min }
          )
          .getCount();

        return { range: range.range, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
