"use client";

import { useEffect } from "react";
import { useWanza } from "@/context/wanza-context";

export default function RefreshCartOnSuccess() {
  const { refreshCart } = useWanza();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return null;
}
