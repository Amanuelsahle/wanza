import { NextResponse } from "next/server";
import { apiError, requireAdmin } from "@/lib/api/auth";
import { deleteProduct, updateProductStock } from "@/lib/db/products";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as { stock?: boolean };

    if (typeof body.stock !== "boolean") {
      return NextResponse.json(
        { error: "stock must be a boolean" },
        { status: 400 },
      );
    }

    const product = await updateProductStock(id, body.stock);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return apiError(error, "Failed to update product");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Failed to delete product");
  }
}
