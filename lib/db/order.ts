import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import type { CartItem } from "@/types/product";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: ObjectId;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  paymentSessionId?: string;
}

export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  paymentSessionId?: string,
): Promise<void> {
  const db = await getDb();
  const orderItems = items.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.image,
  }));
  await db.collection<Order>(COLLECTIONS.orders).insertOne({
    userId,
    items: orderItems,
    total,
    createdAt: new Date(),
    paymentSessionId,
  } as any);
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const db = await getDb();
  const orders = await db
    .collection<Order>(COLLECTIONS.orders)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  return orders;
}
