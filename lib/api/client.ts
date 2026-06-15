import type { CartItem, Product, ProductInput } from "@/types/product";

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  const data = await parseJson<{ products: Product[] }>(response);
  return data.products;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ product: Product }>(response);
  return data.product;
}

export async function toggleProductStock(
  id: string,
  stock: boolean,
): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });
  const data = await parseJson<{ product: Product }>(response);
  return data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
  await parseJson<{ success: boolean }>(response);
}

export async function fetchCart(): Promise<CartItem[]> {
  const response = await fetch("/api/cart");
  const data = await parseJson<{ cart: CartItem[] }>(response);
  return data.cart;
}

export async function addProductToCart(productId: string): Promise<CartItem[]> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", productId }),
  });
  const data = await parseJson<{ cart: CartItem[] }>(response);
  return data.cart;
}

export async function updateCartItemQuantity(
  productId: string,
  amount: number,
): Promise<CartItem[]> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", productId, amount }),
  });
  const data = await parseJson<{ cart: CartItem[] }>(response);
  return data.cart;
}

export async function removeCartItem(productId: string): Promise<CartItem[]> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", productId }),
  });
  const data = await parseJson<{ cart: CartItem[] }>(response);
  return data.cart;
}
