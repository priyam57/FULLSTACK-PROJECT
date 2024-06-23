import { Request, Response } from "express";
import Transaction from "../entities/Transaction";
import { getRepository } from "typeorm";

export const getTransactions = async (req: Request, res: Response) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  console.log(`Received Month: ${month}`);

  const query = getRepository(Transaction)
    .createQueryBuilder("transaction")
    .where(
      `to_char(to_date(transaction.date_of_sale, 'YYYY-MM-DD'), 'Month') ILIKE :month`,
      { month: `${month}%` }
    );

  if (search) {
    query.andWhere(
      "(transaction.title ILIKE :search OR transaction.description ILIKE :search OR transaction.price::text ILIKE :search)",
      { search: `%${search}%` }
    );
  }

  console.log(`Generated query: ${query.getSql()}`);

  const [transactions, total] = await query
    .skip((+page - 1) * +perPage)
    .take(+perPage)
    .getManyAndCount();

  console.log(`Fetched transactions: ${transactions.length}, Total: ${total}`);

  res.json({
    data: transactions,
    total,
    page: +page,
    perPage: +perPage,
    totalPages: Math.ceil(total / +perPage),
  });
};
