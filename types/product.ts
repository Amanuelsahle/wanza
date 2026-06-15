export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartItemRecord {
  productId: string;
  quantity: number;
}
