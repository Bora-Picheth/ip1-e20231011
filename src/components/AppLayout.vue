<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const links = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/products', label: 'Products', exact: false },
  { to: '/movements', label: 'Stock movements', exact: true },
  { to: '/movements/new', label: 'Record movement', exact: true },
]

function isActive(link: (typeof links)[number]): boolean {
  return link.exact ? route.path === link.to : route.path.startsWith(link.to)
}

function onLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <h1 class="brand">Shop Inventory</h1>
      <nav aria-label="Main">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ active: isActive(link) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="content">
      <header class="topbar">
        <span class="muted">Signed in as</span>
        <strong>{{ auth.user?.name }}</strong>
        <span class="badge">{{ auth.user?.role }}</span>
        <button type="button" class="btn btn-secondary" @click="onLogout">Log out</button>
      </header>

      <main class="page">

        <RouterView />
      </main>
    </div>
  </div>
</template>