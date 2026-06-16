import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db/order";

export async function GET(req: Request) {
  const { userId, sessionClaims } = await auth();
  // ensure admin role via middleware/claims
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}
