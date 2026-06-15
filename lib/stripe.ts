import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
}

// Removing apiVersion allows the SDK to safely default to its built-in version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
