<script setup lang="ts">
defineProps<{ title: string; message?: string }>()
</script>

<template>
  <div class="state state--center">
    <h3>{{ title }}</h3>
    <p v-if="message" class="muted">{{ message }}</p>
    <slot />
  </div>
</template>