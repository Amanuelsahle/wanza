import { NextResponse } from "next/server";
import { apiError, requireUserId } from "@/lib/api/auth";
import {
  addToCart,
  getCartForUser,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/db/carts";

export async function GET() {
  try {
    const userId = await requireUserId();
    const cart = await getCartForUser(userId);
    return NextResponse.json({ cart });
  } catch (error) {
    return apiError(error, "Failed to fetch cart");
  }
}

type CartAction = "add" | "update" | "remove";

interface CartRequestBody {
  action: CartAction;
  productId: string;
  amount?: number;
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = (await request.json()) as CartRequestBody;

    if (!body.productId || !body.action) {
      return NextResponse.json(
        { error: "action and productId are required" },
        { status: 400 },
      );
    }

    let cart;

    switch (body.action) {
      case "add":
        cart = await addToCart(userId, body.productId);
        break;
      case "update": {
        if (typeof body.amount !== "number" || body.amount === 0) {
          return NextResponse.json(
            { error: "amount must be a non-zero number" },
            { status: 400 },
          );
        }
        cart = await updateCartQuantity(userId, body.productId, body.amount);
        break;
      }
      case "remove":
        cart = await removeFromCart(userId, body.productId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    return apiError(error, "Failed to update cart");
  }
}
