<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validateLogin } from '../utils/validation'
import type { LoginErrors } from '../utils/validation'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()


const form = reactive({ email: '', password: '' })
const errors = ref<LoginErrors>({})

function runValidation(): boolean {
  errors.value = validateLogin(form)
  return Object.keys(errors.value).length === 0
}

async function onSubmit() {
  if (!runValidation()) return 

  const ok = await auth.login(form.email, form.password)
  if (!ok) return 


  const redirect = route.query.redirect
  const safe = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
  router.push(safe ? redirect : '/')
}
</script>

<template>
  <div class="login-wrap">
    <form class="card login-card" novalidate @submit.prevent="onSubmit">
      <h1>Shop Inventory</h1>
      <p class="muted">Sign in to continue</p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" autocomplete="username" @blur="runValidation" />
        <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          @blur="runValidation"
        />
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      </div>

      <p v-if="auth.error" class="alert alert--error" role="alert">{{ auth.error }}</p>

      <button type="submit" class="btn btn-primary btn-block" :disabled="auth.isLoading">
        {{ auth.isLoading ? 'Signing in…' : 'Log in' }}
      </button>

      <p class="muted small">Demo: dara@shop.com / Manager123 (manager) · sok@shop.com / Staff1234 (staff)</p>
    </form>
  </div>
</template>