import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { categoryService } from '../services/categoryService'
import { ApiError, toMessage } from '../services/http'
import { productService } from '../services/productService'
import type { Category, Product } from '../types'
import { getStockLevel } from '../utils/stock'

export const useProductsStore = defineStore('products', () => {

  const items = ref<Product[]>([]) 
  const categories = ref<Category[]>([])
  const selected = ref<Product | null>(null) 
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const notFound = ref(false) 


  const lowStockItems = computed(() =>
    items.value
      .filter((p) => getStockLevel(p) !== 'OK')
      .sort((a, b) => a.currentStock - b.currentStock),
  )


  async function fetchAll() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await productService.list()
    } catch (e) {
      error.value = toMessage(e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOne(id: number) {
    isLoading.value = true
    error.value = null
    notFound.value = false
    selected.value = null
    try {
      selected.value = await productService.get(id)
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) notFound.value = true
      else error.value = toMessage(e)
    } finally {
      isLoading.value = false
    }
  }


  async function fetchCategories() {
    if (categories.value.length > 0) return
    try {
      categories.value = await categoryService.list()
    } catch {
      categories.value = []
    }
  }


  function replaceProduct(updated: Product) {
    const index = items.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) items.value[index] = updated
    if (selected.value?.id === updated.id) selected.value = updated
  }

  function productName(id: number): string {
    return items.value.find((p) => p.id === id)?.name ?? `Product #${id}`
  }

  function categoryName(id: number): string {
    return categories.value.find((c) => c.id === id)?.name ?? '-'
  }

  return {
    items,
    categories,
    selected,
    isLoading,
    error,
    notFound,
    lowStockItems,
    fetchAll,
    fetchOne,
    fetchCategories,
    replaceProduct,
    productName,
    categoryName,
  }
})