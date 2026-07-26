export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  unitPrice: number;
    compareAtPrice: number | null;   // ← add

  quantity: number;
  lineTotal: number;
  /** Live stock. If it dropped below quantity, warn before checkout. */
  availableStock: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}