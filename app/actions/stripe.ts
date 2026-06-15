"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { calculateCartTotals } from "@/lib/cart-totals";
import { getCartForUser } from "@/lib/db/carts";
import { redirect } from "next/navigation";
import type Stripe from "stripe";

export async function handleCheckout(): Promise<never> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to checkout.");
  }

  const cart = await getCartForUser(userId);

  if (cart.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const { shipping, tax } = calculateCartTotals(cart);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map(
    (item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          description: item.product.description.slice(0, 500) || undefined,
          images: item.product.image ? [item.product.image] : undefined,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }),
  );

  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
  }

  if (tax > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Estimated Tax (8.25%)" },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let session;

  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: { userId },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    throw new Error("Failed to create checkout session.");
  }

  if (!session.url) {
    throw new Error("Stripe session URL generation failed.");
  }

  redirect(session.url);
}
