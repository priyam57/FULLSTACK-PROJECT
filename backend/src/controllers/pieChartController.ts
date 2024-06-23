import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Transaction from "../entities/Transaction";

export const getPieChartData = async (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  const monthNumber = new Date(`${month} 01, 2020`).getMonth() + 1;

  try {
    const categories = await getRepository(Transaction)
      .createQueryBuilder("transaction")
      .select("transaction.category")
      .addSelect("COUNT(*)", "count")
      .where(
        `EXTRACT(MONTH FROM to_date(transaction.date_of_sale, 'YYYY-MM-DD')) = :month`,
        { month: monthNumber }
      )
      .groupBy("transaction.category")
      .getRawMany();

    const pieChartData = categories.map((category) => ({
      category: category.transaction_category,
      count: parseInt(category.count, 10),
    }));

    res.json(pieChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
