import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiError, toMessage } from '../services/http'
import { movementService } from '../services/movementService'
import { productService } from '../services/productService'
import type { MovementInput, StockMovement } from '../types'
import { useAuthStore } from './auth'
import { useProductsStore } from './products'

export const useMovementsStore = defineStore('movements', () => {

  const items = ref<StockMovement[]>([]) 
  const productItems = ref<StockMovement[]>([]) 
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)


  async function fetchAll() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await movementService.list()
    } catch (e) {
      error.value = toMessage(e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchForProduct(productId: number) {
    isLoading.value = true
    error.value = null
    try {
      productItems.value = await movementService.listByProduct(productId)
    } catch (e) {
      error.value = toMessage(e)
    } finally {
      isLoading.value = false
    }
  }


  async function record(input: MovementInput): Promise<StockMovement | null> {
    const auth = useAuthStore()
    const products = useProductsStore()
    if (!auth.user) {
      error.value = 'Please log in again.'
      return null
    }

    isSaving.value = true
    error.value = null
    try {

      const product = await productService.get(input.productId)

      if (input.type === 'STOCK_OUT' && input.quantity > product.currentStock) {
        throw new ApiError(
          409,
          `Not enough stock. Only ${product.currentStock} left for ${product.name}.`,
        )
      }


      const saved = await movementService.create({
        ...input,
        status: 'COMPLETED',
        createdBy: auth.user.id,
        createdByName: auth.user.name,
        createdAt: new Date().toISOString(),
      })
      const change = input.type === 'STOCK_IN' ? input.quantity : -input.quantity
      const updated = await productService.update(product.id, {
        currentStock: product.currentStock + change,
      })


      products.replaceProduct(updated)
      items.value.unshift(saved)
      return saved
    } catch (e) {
      error.value = toMessage(e)
      return null
    } finally {
      isSaving.value = false
    }
  }

  return { items, productItems, isLoading, isSaving, error, fetchAll, fetchForProduct, record }
})