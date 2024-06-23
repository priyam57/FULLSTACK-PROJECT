import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Transaction from "../entities/Transaction";

export const getStatistics = async (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  const monthNumber = new Date(`${month} 01, 2020`).getMonth() + 1;

  try {
    const totalSales = await getRepository(Transaction)
      .createQueryBuilder("transaction")
      .select("SUM(transaction.price)", "total")
      .where(
        `EXTRACT(MONTH FROM to_date(transaction.date_of_sale, 'YYYY-MM-DD')) = :month`,
        { month: monthNumber }
      )
      .getRawOne();

    const soldItems = await getRepository(Transaction)
      .createQueryBuilder("transaction")
      .select("COUNT(*)", "count")
      .where(
        `EXTRACT(MONTH FROM to_date(transaction.date_of_sale, 'YYYY-MM-DD')) = :month`,
        { month: monthNumber }
      )
      .andWhere("transaction.sold = true")
      .getRawOne();

    const notSoldItems = await getRepository(Transaction)
      .createQueryBuilder("transaction")
      .select("COUNT(*)", "count")
      .where(
        `EXTRACT(MONTH FROM to_date(transaction.date_of_sale, 'YYYY-MM-DD')) = :month`,
        { month: monthNumber }
      )
      .andWhere("transaction.sold = false")
      .getRawOne();

    res.json({
      totalSales: parseFloat(totalSales.total) || 0,
      soldItems: parseInt(soldItems.count) || 0,
      notSoldItems: parseInt(notSoldItems.count) || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
