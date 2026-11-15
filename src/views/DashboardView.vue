<script setup lang="ts">
import { computed, onMounted } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import StockBadge from '../components/StockBadge.vue'
import { useMovementsStore } from '../stores/movements'
import { useProductsStore } from '../stores/products'
import { formatDateTime, isToday } from '../utils/format'
import { getStockLevel } from '../utils/stock'

const products = useProductsStore()
const movements = useMovementsStore()

function load() {
  products.fetchAll()
  movements.fetchAll()
}
onMounted(load)

const isLoading = computed(() => products.isLoading || movements.isLoading)
const error = computed(() => products.error ?? movements.error)
const movementsToday = computed(() => movements.items.filter((m) => isToday(m.createdAt)).length)
const recent = computed(() => movements.items.slice(0, 5)) // already newest-first
</script>

<template>
  <div class="page-head">
    <h2 class="page-title">Dashboard</h2>
    <RouterLink :to="{ name: 'movement-new' }" class="btn btn-primary">+ Record stock movement</RouterLink>
  </div>

  <LoadingState v-if="isLoading" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />

  <template v-else>
    <section class="grid-3">
      <div class="card">
        <p class="muted">Products</p>
        <p class="stat">{{ products.items.length }}</p>
      </div>
      <div class="card">
        <p class="muted">Low-stock alerts</p>
        <p class="stat">{{ products.lowStockItems.length }}</p>
      </div>
      <div class="card">
        <p class="muted">Movements today</p>
        <p class="stat">{{ movementsToday }}</p>
      </div>
    </section>

    <section class="grid-2">
      <div class="card">
        <h3>Low-stock items</h3>
        <EmptyState v-if="products.lowStockItems.length === 0" title="All stock levels are fine" />
        <ul v-else class="list">
          <li v-for="p in products.lowStockItems" :key="p.id">
            <div>
              <RouterLink :to="{ name: 'product-detail', params: { id: p.id } }">{{ p.name }}</RouterLink>
              <p class="muted small">Stock {{ p.currentStock }} / min {{ p.minStockThreshold }}</p>
            </div>
            <StockBadge :level="getStockLevel(p)" />
          </li>
        </ul>
      </div>

      <div class="card">
        <h3>Recent movements</h3>
        <EmptyState v-if="recent.length === 0" title="No movements yet" />
        <ul v-else class="list">
          <li v-for="m in recent" :key="m.id">
            <div>
              {{ products.productName(m.productId) }}
              <p class="muted small">{{ formatDateTime(m.createdAt) }} · {{ m.createdByName }}</p>
            </div>
            <strong>{{ m.type === 'STOCK_IN' ? '+' : '-' }}{{ m.quantity }}</strong>
          </li>
        </ul>
      </div>
    </section>
  </template>
</template>