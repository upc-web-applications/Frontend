import { BaseApi } from '@/shared/infrastructure/base-api.js'

export class IdentityAccessApi extends BaseApi {
  signIn(email, password) {
    return this.http.post('/identity/auth/sign-in', { email, password })
  }
}
