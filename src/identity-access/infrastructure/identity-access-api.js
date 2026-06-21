import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class IdentityAccessApi extends BaseApi {
  #usersEndpoint
  #rolesEndpoint
  #sessionsEndpoint
  #accessLogsEndpoint

  constructor() {
    super()
    this.#usersEndpoint = new BaseEndpoint(this, '/users')
    this.#rolesEndpoint = new BaseEndpoint(this, '/roles')
    this.#sessionsEndpoint = new BaseEndpoint(this, '/sessions')
    this.#accessLogsEndpoint = new BaseEndpoint(this, '/accessLogs')
  }

  getUsers() {
    return this.#usersEndpoint.getAll()
  }

  getRoles() {
    return this.#rolesEndpoint.getAll()
  }

  updateUser(user) {
    return this.#usersEndpoint.update(user.id, user)
  }

  createSession(session) {
    return this.#sessionsEndpoint.create(session)
  }

  updateSession(session) {
    return this.#sessionsEndpoint.update(session.id, session)
  }

  createAccessLog(log) {
    return this.#accessLogsEndpoint.create(log)
  }
}
