export type Role = "MANAGER" | "STAFF";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type SessionUser = Omit<User, "password">;

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  categoryId: number;
  price: number;
  currentStock: number;
  minStockThreshold: number;
  isDeleted: boolean;
}

export type MovementType = "STOCK_IN" | "STOCK_OUT";
export type MovementStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "VOIDED";

export interface StockMovement {
  id: number;
  productId: number;
  type: MovementType;
  quantity: number;
  reason: string;
  note: string;
  status: MovementStatus;
  createdBy: number;
  createdByName: string;
  createdAt: string;
}

export interface MovementInput {
  productId: number;
  type: MovementType;
  quantity: number;
  reason: string;
  note: string;
}

export type NewMovement = Omit<StockMovement, "id">;
export type StockLevel = "OK" | "LOW" | "OUT";
