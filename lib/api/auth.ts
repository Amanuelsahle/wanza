import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") {
    throw new Error("Forbidden");
  }

  return userId;
}

function getMongoConnectionHint(error: Error): string | null {
  const message = error.message;

  if (message.includes("querySrv ECONNREFUSED")) {
    return "MongoDB DNS lookup failed. Restart the dev server after pulling the latest changes.";
  }

  if (
    message.includes("tlsv1 alert internal error") ||
    message.includes("Server selection timed out") ||
    message.includes("ECONNREFUSED")
  ) {
    return "MongoDB connection refused. In Atlas, open Network Access and allow your current IP (or 0.0.0.0/0 for local dev).";
  }

  if (
    message.includes("bad auth") ||
    message.includes("Authentication failed")
  ) {
    return "MongoDB authentication failed. Check MONGODB_URI username and password in .env.local.";
  }

  return null;
}

export function apiError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (
      error.message === "Invalid product id" ||
      error.message === "Product not found or out of stock"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const mongoHint = getMongoConnectionHint(error);
    if (mongoHint) {
      console.error(fallbackMessage, error);
      return NextResponse.json({ error: mongoHint }, { status: 503 });
    }
  }

  console.error(fallbackMessage, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
