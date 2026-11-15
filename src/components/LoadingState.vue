<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Loading…' })
</script>

<template>
  <div class="state" role="status" aria-live="polite">
    <div v-for="n in 5" :key="n" class="skeleton" />
    <p class="muted">{{ label }}</p>
  </div>
</template>