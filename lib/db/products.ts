import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import {
  serializeProduct,
  toObjectId,
  type ProductDocument,
} from "@/lib/db/serializers";
import type { Product, ProductInput } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const db = await getDb();
  const docs = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(serializeProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const doc = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .findOne({ _id: toObjectId(id) });

  return doc ? serializeProduct(doc) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const db = await getDb();
  const now = new Date();

  const document: Omit<ProductDocument, "_id"> = {
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    image: input.image.trim(),
    category: input.category.trim(),
    stock: input.stock ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .insertOne(document as ProductDocument);

  const created = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .findOne({ _id: result.insertedId });

  if (!created) {
    throw new Error("Failed to create product");
  }

  return serializeProduct(created);
}

export async function updateProductStock(
  id: string,
  stock: boolean,
): Promise<Product | null> {
  const db = await getDb();
  const result = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .findOneAndUpdate(
      { _id: toObjectId(id) },
      { $set: { stock, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

  return result ? serializeProduct(result) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .deleteOne({ _id: toObjectId(id) });

  return result.deletedCount === 1;
}
