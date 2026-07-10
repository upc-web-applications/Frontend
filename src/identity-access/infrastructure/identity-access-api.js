import { BaseApi } from '@/shared/infrastructure/base-api.js'

export class IdentityAccessApi extends BaseApi {
  signIn(email, password) {
    return this.http.post('/authentication/sign-in', { email, password })
  }
}
