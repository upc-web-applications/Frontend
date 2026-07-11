import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { IdentityAccessApi } from '@/identity-access/infrastructure/identity-access-api.js'
import { User } from '@/identity-access/domain/model/user-entity.js'

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
      id: currentUser.value.roleId || 'operator',
      code: ROLE_MAP[currentUser.value.roleId] || 'plant-operator',
      name: currentUser.value.roleId
    }
  })

  function authenticate(email, password) {
    return identityAccessApi.signIn(email, password)
      .then(response => {
        const data = response.data
        const user = new User({
          id: data.id,
          email: data.email,
          fullName: data.name,
          roleId: data.role
        })
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
