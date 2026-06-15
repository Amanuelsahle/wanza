import type { CartItem } from "@/types/product";

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function calculateCartTotals(cart: CartItem[]): CartTotals {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal === 0 ? 0 : subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}
