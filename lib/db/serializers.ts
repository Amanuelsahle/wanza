import { ObjectId, type Document } from "mongodb";
import type { Product } from "@/types/product";

export interface ProductDocument extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function serializeProduct(doc: ProductDocument): Product {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
    stock: doc.stock,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product id");
  }
  return new ObjectId(id);
}
