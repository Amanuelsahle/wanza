import { NextResponse } from "next/server";
import { apiError, requireAdmin } from "@/lib/api/auth";
import { createProduct, getProducts } from "@/lib/db/products";
import { seedProductsIfEmpty } from "@/lib/db/seed";
import type { ProductInput } from "@/types/product";

export async function GET() {
  try {
    await seedProductsIfEmpty();
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return apiError(error, "Failed to fetch products");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as ProductInput;

    if (!body.title?.trim() || !body.description?.trim() || !body.image?.trim()) {
      return NextResponse.json(
        { error: "Title, description, and image are required" },
        { status: 400 },
      );
    }

    if (typeof body.price !== "number" || body.price < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number" },
        { status: 400 },
      );
    }

    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create product");
  }
}
