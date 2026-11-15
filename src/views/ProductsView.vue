<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import StockBadge from '../components/StockBadge.vue'
import { useProductsStore } from '../stores/products'
import type { StockLevel } from '../types'
import { formatMoney } from '../utils/format'
import { getStockLevel } from '../utils/stock'

const products = useProductsStore()

const PAGE_SIZE = 8

const search = ref('')
const categoryId = ref<number | null>(null)
const status = ref<'ALL' | StockLevel>('ALL')
const page = ref(1)

function load() {
  products.fetchAll()
  products.fetchCategories()
}
onMounted(load)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return products.items.filter((p) => {
    const matchesText = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    const matchesCategory = categoryId.value === null || p.categoryId === categoryId.value
    const matchesStatus = status.value === 'ALL' || getStockLevel(p) === status.value
    return matchesText && matchesCategory && matchesStatus
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
const firstShown = computed(() => (filtered.value.length === 0 ? 0 : (page.value - 1) * PAGE_SIZE + 1))
const lastShown = computed(() => Math.min(page.value * PAGE_SIZE, filtered.value.length))


watch([search, categoryId, status], () => {
  page.value = 1
})

function clearFilters() {
  search.value = ''
  categoryId.value = null
  status.value = 'ALL'
}
</script>

<template>
  <div class="page-head">
    <h2 class="page-title">Products</h2>
  </div>

  <div class="toolbar">
    <input v-model="search" type="search" placeholder="Search name or SKU…" aria-label="Search products" />
    <select v-model.number="categoryId" aria-label="Filter by category">
      <option :value="null">All categories</option>
      <option v-for="c in products.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>
    <select v-model="status" aria-label="Filter by stock status">
      <option value="ALL">All statuses</option>
      <option value="OK">OK</option>
      <option value="LOW">Low</option>
      <option value="OUT">Out of stock</option>
    </select>
  </div>


  <LoadingState v-if="products.isLoading" />
  <ErrorState v-else-if="products.error" :message="products.error" @retry="load" />
  <EmptyState v-else-if="products.items.length === 0" title="No products yet" message="Products will appear here once they are added." />
  <EmptyState v-else-if="filtered.length === 0" title="No products found" message="Try another search or clear the filters.">
    <button type="button" class="btn btn-secondary" @click="clearFilters">Clear filters</button>
  </EmptyState>

  <template v-else>
    <table class="table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Category</th>
          <th class="num">Price</th>
          <th class="num">Stock</th>
          <th class="num">Min</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in paged" :key="p.id">
          <td data-label="SKU">{{ p.sku }}</td>
          <td data-label="Name">
            <!-- params.id becomes the ":id" of /products/:id -->
            <RouterLink :to="{ name: 'product-detail', params: { id: p.id } }">{{ p.name }}</RouterLink>
          </td>
          <td data-label="Category">{{ products.categoryName(p.categoryId) }}</td>
          <td data-label="Price" class="num">{{ formatMoney(p.price) }}</td>
          <td data-label="Stock" class="num">{{ p.currentStock }}</td>
          <td data-label="Min" class="num">{{ p.minStockThreshold }}</td>
          <td data-label="Status"><StockBadge :level="getStockLevel(p)" /></td>
        </tr>
      </tbody>
    </table>

    <nav class="pagination" aria-label="Pagination">
      <span class="muted">Showing {{ firstShown }}–{{ lastShown }} of {{ filtered.length }}</span>
      <div>
        <button type="button" class="btn btn-secondary" :disabled="page <= 1" @click="page--">‹ Prev</button>
        <span class="muted">Page {{ page }} of {{ pageCount }}</span>
        <button type="button" class="btn btn-secondary" :disabled="page >= pageCount" @click="page++">Next ›</button>
      </div>
    </nav>
  </template>
</template>