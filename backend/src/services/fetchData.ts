import axios from "axios";
import Transaction from "../entities/Transaction";

const apiUrl = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

export const fetchAndSeedData = async () => {
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    await Transaction.clear(); // Clear existing data

    for (const item of data) {
      const transaction = Transaction.create({
        title: item.title || "No Title",
        description: item.description || "No Description",
        price: parseFloat(item.price) || 0,
        dateOfSale: item.dateOfSale || "1970-01-01",
        category: item.category || "Uncategorized",
        image: item.image || "No Image",
        sold: item.sold !== undefined ? item.sold : false,
      });
      await transaction.save();
    }

    console.log("Database has been initialized with seed data");
  } catch (error) {
    console.error("Error fetching or seeding data:", error);
  }
};
