import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { IdentityAccessApi } from '@/identity-access/infrastructure/identity-access-api.js'
import { UserAssembler } from '@/identity-access/infrastructure/user.assembler.js'
import { SessionAssembler } from '@/identity-access/infrastructure/session.assembler.js'
import { AccessLogAssembler } from '@/identity-access/infrastructure/access-log.assembler.js'
import { User } from '@/identity-access/domain/model/user-entity.js'
import { Session } from '@/identity-access/domain/model/session-entity.js'
import { AccessLog } from '@/identity-access/domain/model/access-log-entity.js'

const identityAccessApi = new IdentityAccessApi()
const ACTIVE_STATUS = 'active'
const BLOCKED_STATUS = 'blocked'
const EMAIL_NOT_REGISTERED_REASON = 'email-not-registered'
const ACCOUNT_BLOCKED_REASON = 'account-blocked'
const INVALID_CREDENTIALS_REASON = 'invalid-credentials'
const MANUAL_LOGOUT_REASON = 'manual-logout'

const useIdentityAccessStore = defineStore('identity-access', () => {
  const users = ref([])
  const roles = ref([])
  const errors = ref([])
  const currentUser = ref(null)
  const currentSession = ref(null)
  const usersLoaded = ref(false)
  const rolesLoaded = ref(false)

  const currentRole = computed(() => {
    if (!currentUser.value) return null
    return roles.value.find(role => role.id === currentUser.value.roleId) || null
  })

  function fetchUsers() {
    return identityAccessApi.getUsers().then(response => {
      users.value = UserAssembler.toEntitiesFromResponse(response)
      usersLoaded.value = true
    }).catch(error => errors.value.push(error))
  }

  function fetchRoles() {
    return identityAccessApi.getRoles().then(response => {
      roles.value = response.status === 200 ? response.data : []
      rolesLoaded.value = true
    }).catch(error => errors.value.push(error))
  }

  function addAccessLog(email, userId, wasSuccessful, failureReason) {
    const log = new AccessLog({
      id: uuid(),
      email: email,
      userId: userId,
      wasSuccessful: wasSuccessful,
      failureReason: failureReason,
      ipAddress: '192.168.1.15',
      attemptAt: new Date().toISOString()
    })
    return identityAccessApi.createAccessLog(log).then(response => {
      return AccessLogAssembler.toEntityFromResource(response.data)
    })
  }

  function authenticate(email, password) {
    if (!usersLoaded.value) {
      return fetchUsers().then(() => authenticate(email, password))
    }
    if (!rolesLoaded.value) {
      return fetchRoles().then(() => authenticate(email, password))
    }

    const user = users.value.find(item => item.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return addAccessLog(email, null, false, EMAIL_NOT_REGISTERED_REASON).then(() => {
        return { success: false, reason: 'invalid' }
      })
    }

    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      return addAccessLog(email, user.id, false, ACCOUNT_BLOCKED_REASON).then(() => {
        return { success: false, reason: 'blocked' }
      })
    }

    if (user.password !== password) {
      user.failedAttempts = user.failedAttempts + 1
      if (user.failedAttempts >= 5) {
        const blockedUntil = new Date()
        blockedUntil.setMinutes(blockedUntil.getMinutes() + 15)
        user.blockedUntil = blockedUntil.toISOString()
        user.status = BLOCKED_STATUS
      }
      return identityAccessApi.updateUser(user).then(() => {
        return addAccessLog(email, user.id, false, INVALID_CREDENTIALS_REASON)
      }).then(() => {
        return { success: false, reason: user.failedAttempts >= 5 ? 'blocked' : 'invalid', attempts: user.failedAttempts }
      })
    }

    user.failedAttempts = 0
    user.blockedUntil = null
    user.status = ACTIVE_STATUS
    const now = new Date().toISOString()
    const session = new Session({
      id: uuid(),
      userId: user.id,
      token: `RG-${uuid()}`,
      createdAt: now,
      lastActivityAt: now,
      isValid: true,
      closedAt: null,
      closeReason: ''
    })

    return identityAccessApi.updateUser(user).then(() => {
      return identityAccessApi.createSession(session)
    }).then(response => {
      currentUser.value = new User(user)
      currentSession.value = SessionAssembler.toEntityFromResource(response.data)
      return addAccessLog(email, user.id, true, '')
    }).then(() => {
      return { success: true, user: currentUser.value }
    })
  }

  function touchSession() {
    if (currentSession.value) {
      currentSession.value.lastActivityAt = new Date().toISOString()
    }
  }

  function logout(closeReason = MANUAL_LOGOUT_REASON) {
    if (currentSession.value) {
      currentSession.value.isValid = false
      currentSession.value.lastActivityAt = new Date().toISOString()
      currentSession.value.closedAt = new Date().toISOString()
      currentSession.value.closeReason = closeReason
      const user = currentUser.value
      const session = currentSession.value
      currentUser.value = null
      currentSession.value = null

      return identityAccessApi.updateSession(session).then(() => {
        if (user) return addAccessLog(user.email, user.id, true, closeReason)
      }).catch(error => {
        errors.value.push(error)
      })
    }
    currentUser.value = null
    currentSession.value = null
    return Promise.resolve()
  }

  return {
    currentUser,
    usersLoaded,
    rolesLoaded,
    currentRole,
    fetchUsers,
    fetchRoles,
    authenticate,
    touchSession,
    logout
  }
})

export default useIdentityAccessStore
