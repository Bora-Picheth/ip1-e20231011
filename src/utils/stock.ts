import type { MovementType, Product, StockLevel } from '../types'

export function getStockLevel(
  product: Pick<Product, 'currentStock' | 'minStockThreshold'>,
): StockLevel {
  if (product.currentStock <= 0) return 'OUT'
  if (product.currentStock <= product.minStockThreshold) return 'LOW'
  return 'OK'
}

export const MOVEMENT_REASONS: Record<MovementType, string[]> = {
  STOCK_IN: ['Delivery', 'Customer return', 'Stock adjustment'],
  STOCK_OUT: ['Sold', 'Damaged', 'Used', 'Expired'],
}