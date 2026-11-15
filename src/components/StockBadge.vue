<script setup lang="ts">
import type { StockLevel } from '../types'

defineProps<{ level: StockLevel }>()
</script>

<template>
  <span class="badge" :class="`badge--${level.toLowerCase()}`">{{ level }}</span>
</template>