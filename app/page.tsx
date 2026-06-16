
import HeroBanner from "@/components/hero";
import ProductGrid from "@/components/productGrid";
import CartDrawer from "@/components/modals/cart";
import CheckoutModal from "@/components/modals/checkout";
import OrdersModal from "@/components/modals/orders";


export default function Home() {
  return (
    <div>
      <HeroBanner />
      <ProductGrid />
      <CartDrawer />
      <CheckoutModal />
      <OrdersModal />
    </div>
  );
}
