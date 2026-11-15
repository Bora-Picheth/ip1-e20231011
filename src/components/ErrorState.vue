<script setup lang="ts">
defineProps<{ message: string }>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state state--center" role="alert">
    <h3>Something went wrong</h3>
    <p class="muted">{{ message }}</p>
    <button type="button" class="btn btn-primary" @click="emit('retry')">Retry</button>
  </div>
</template>