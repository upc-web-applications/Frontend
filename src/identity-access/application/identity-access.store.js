import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { IdentityAccessApi } from '@/identity-access/infrastructure/identity-access-api.js'

const ROLE_MAP = {
  Administrator: 'administrator',
  Supervisor: 'supervisor',
  Operator: 'plant-operator'
}

const USER_STORAGE_KEY = 'riskguard-current-user'

function readStoredUser() {
  try {
    const resource = JSON.parse(localStorage.getItem(USER_STORAGE_KEY))
    return resource || null
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

const useIdentityAccessStore = defineStore('identity-access', () => {
  const identityAccessApi = new IdentityAccessApi()
  const errors = ref([])
  const currentUser = ref(readStoredUser())

  const currentRole = computed(() => {
    if (!currentUser.value) return null
    return {
      id: currentUser.value.role || 'operator',
      code: ROLE_MAP[currentUser.value.role] || 'plant-operator',
      name: currentUser.value.role
    }
  })

  function authenticate(email, password) {
    return identityAccessApi.signIn(email, password)
      .then(response => {
        const data = response.data
        const user = {
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
          role: data.role
        }
        currentUser.value = user
        BaseApi.setToken(data.token)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
        return { success: true, user }
      })
      .catch(error => {
        const failureReason = error.response?.status === 401 ? 'invalid' : 'error'
        return { success: false, reason: failureReason }
      })
  }

  function logout() {
    currentUser.value = null
    BaseApi.clearToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    return Promise.resolve()
  }

  return {
    currentUser,
    currentRole,
    authenticate,
    logout
  }
})

export default useIdentityAccessStore
