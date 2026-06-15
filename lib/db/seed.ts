import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { INITIAL_PRODUCTS } from "@/data/seed";
import type { ProductDocument } from "@/lib/db/serializers";

export async function seedProductsIfEmpty(): Promise<number> {
  const db = await getDb();
  const collection = db.collection<ProductDocument>(COLLECTIONS.products);
  const count = await collection.countDocuments();

  if (count > 0) {
    return 0;
  }

  const now = new Date();
  const documents = INITIAL_PRODUCTS.map((product) => ({
    title: product.title,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    stock: product.stock,
    createdAt: now,
    updatedAt: now,
  }));

  const result = await collection.insertMany(
    documents as ProductDocument[],
  );

  return result.insertedCount;
}
