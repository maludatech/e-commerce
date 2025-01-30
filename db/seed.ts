import data from "@/lib/data";
import { connectToDb } from "@/utils/database";
import Product from "./models/product.model";
import User from "./models/user.model";
import Review from "./models/review.model";
import { cwd } from "process";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());

const main = async () => {
  try {
    const { products, users, reviews } = data;
    await connectToDb();

    await User.deleteMany();
    const createdUsers = await User.insertMany(users);

    await Product.deleteMany();
    const createdProducts = await Product.insertMany(products);

    await Review.deleteMany();
    const createdReviews = await Review.insertMany(reviews);

    console.log({
      createdProducts,
      createdUsers,
      createdReviews,
      message: "Seeded database successfully",
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
