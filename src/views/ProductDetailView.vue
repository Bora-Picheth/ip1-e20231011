<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import StockBadge from '../components/StockBadge.vue'
import { useMovementsStore } from '../stores/movements'
import { useProductsStore } from '../stores/products'
import { formatDateTime, formatMoney } from '../utils/format'
import { getStockLevel } from '../utils/stock'

const route = useRoute()
const products = useProductsStore()
const movements = useMovementsStore()


const id = computed(() => Number(route.params.id))

function load() {
  products.fetchOne(id.value)
  products.fetchCategories()
  movements.fetchForProduct(id.value)
}

watch(id, load, { immediate: true })
</script>

<template>
  <RouterLink :to="{ name: 'products' }" class="back-link">‹ Back to products</RouterLink>

  <LoadingState v-if="products.isLoading" />
  <EmptyState v-else-if="products.notFound" title="Product not found" message="This product does not exist or was removed." />
  <ErrorState v-else-if="products.error" :message="products.error" @retry="load" />

  <template v-else-if="products.selected">
    <section class="card">
      <div class="page-head">
        <div>
          <h2 class="page-title">{{ products.selected.name }}</h2>
          <p class="muted">SKU {{ products.selected.sku }} · {{ products.categoryName(products.selected.categoryId) }}</p>
        </div>
        <StockBadge :level="getStockLevel(products.selected)" />
      </div>

      <dl class="facts">
        <div>
          <dt>Unit price</dt>
          <dd>{{ formatMoney(products.selected.price) }}</dd>
        </div>
        <div>
          <dt>Current stock</dt>
          <dd>{{ products.selected.currentStock }}</dd>
        </div>
        <div>
          <dt>Minimum threshold</dt>
          <dd>{{ products.selected.minStockThreshold }}</dd>
        </div>
      </dl>

      <RouterLink
        :to="{ name: 'movement-new', query: { productId: products.selected.id } }"
        class="btn btn-primary"
      >
        Record movement
      </RouterLink>
    </section>

    <section class="card">
      <h3>Movement history</h3>
      <LoadingState v-if="movements.isLoading" />
      <ErrorState v-else-if="movements.error" :message="movements.error" @retry="load" />
      <EmptyState v-else-if="movements.productItems.length === 0" title="No movements yet" message="Record the first stock-in or stock-out for this product." />
      <table v-else class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th class="num">Qty</th>
            <th>Reason</th>
            <th>By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in movements.productItems" :key="m.id">
            <td data-label="Date">{{ formatDateTime(m.createdAt) }}</td>
            <td data-label="Type">{{ m.type === 'STOCK_IN' ? 'IN' : 'OUT' }}</td>
            <td data-label="Qty" class="num">{{ m.type === 'STOCK_IN' ? '+' : '-' }}{{ m.quantity }}</td>
            <td data-label="Reason">{{ m.reason }}</td>
            <td data-label="By">{{ m.createdByName }}</td>
            <td data-label="Status">{{ m.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
</template>