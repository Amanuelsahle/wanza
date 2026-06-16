import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrdersForUser } from "@/lib/db/order";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrdersForUser(userId);
  return NextResponse.json({ orders });
}
