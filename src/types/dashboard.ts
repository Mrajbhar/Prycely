export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  averageOrderValue: number;
}

export interface RevenuePoint {
  date: string; // yyyy-MM-dd
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  imageUrl: string | null;
  unitsSold: number;
  revenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface CategorySales {
  categoryName: string;
  unitsSold: number;
  revenue: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  sku: string;
  stock: number;
}