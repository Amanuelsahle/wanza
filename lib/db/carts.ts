import { ObjectId, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import {
  serializeProduct,
  toObjectId,
  type ProductDocument,
} from "@/lib/db/serializers";
import type { CartItem } from "@/types/product";

interface CartItemDocument {
  productId: ObjectId;
  quantity: number;
}

interface CartDocument extends Document {
  _id: ObjectId;
  userId: string;
  items: CartItemDocument[];
  updatedAt: Date;
}

async function getCartCollection() {
  const db = await getDb();
  return db.collection<CartDocument>(COLLECTIONS.carts);
}

export async function getCartForUser(userId: string): Promise<CartItem[]> {
  const carts = await getCartCollection();
  const cart = await carts.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    return [];
  }

  const db = await getDb();
  const productIds = cart.items.map((item) => item.productId);
  const products = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .find({ _id: { $in: productIds } })
    .toArray();

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  return cart.items
    .map((item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) return null;
      return {
        product: serializeProduct(product),
        quantity: item.quantity,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

async function upsertCart(
  userId: string,
  items: CartItemDocument[],
): Promise<void> {
  const carts = await getCartCollection();
  await carts.updateOne(
    { userId },
    { $set: { items, updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function addToCart(
  userId: string,
  productId: string,
): Promise<CartItem[]> {
  const db = await getDb();
  const product = await db
    .collection<ProductDocument>(COLLECTIONS.products)
    .findOne({ _id: toObjectId(productId), stock: true });

  if (!product) {
    throw new Error("Product not found or out of stock");
  }

  const carts = await getCartCollection();
  const cart = await carts.findOne({ userId });
  const items = cart?.items ?? [];
  const objectId = toObjectId(productId);
  const existing = items.find((item) => item.productId.equals(objectId));

  const nextItems = existing
    ? items.map((item) =>
        item.productId.equals(objectId)
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, { productId: objectId, quantity: 1 }];

  await upsertCart(userId, nextItems);
  return getCartForUser(userId);
}

export async function updateCartQuantity(
  userId: string,
  productId: string,
  amount: number,
): Promise<CartItem[]> {
  const carts = await getCartCollection();
  const cart = await carts.findOne({ userId });

  if (!cart) {
    return [];
  }

  const objectId = toObjectId(productId);
  const nextItems = cart.items
    .map((item) => {
      if (!item.productId.equals(objectId)) return item;
      const quantity = item.quantity + amount;
      return quantity > 0 ? { ...item, quantity } : null;
    })
    .filter((item): item is CartItemDocument => item !== null);

  await upsertCart(userId, nextItems);
  return getCartForUser(userId);
}

export async function removeFromCart(
  userId: string,
  productId: string,
): Promise<CartItem[]> {
  const carts = await getCartCollection();
  const cart = await carts.findOne({ userId });

  if (!cart) {
    return [];
  }

  const objectId = toObjectId(productId);
  const nextItems = cart.items.filter(
    (item) => !item.productId.equals(objectId),
  );

  await upsertCart(userId, nextItems);
  return getCartForUser(userId);
}

export async function clearCart(userId: string): Promise<void> {
  const carts = await getCartCollection();
  await carts.updateOne(
    { userId },
    { $set: { items: [], updatedAt: new Date() } },
    { upsert: true },
  );
}
