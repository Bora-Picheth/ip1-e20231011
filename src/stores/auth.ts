import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { toMessage } from '../services/http'
import type { SessionUser } from '../types'

const STORAGE_KEY = 'shop-inventory:user'


function loadSavedUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {

  const user = ref<SessionUser | null>(loadSavedUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)


  const isLoggedIn = computed(() => user.value !== null)
  const isManager = computed(() => user.value?.role === 'MANAGER')


  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      user.value = await authService.login(email.trim(), password)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
      return true
    } catch (e) {
      error.value = toMessage(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isLoading, error, isLoggedIn, isManager, login, logout }
})