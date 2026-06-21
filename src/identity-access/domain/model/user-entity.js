export class User {
  constructor({
    id = null,
    roleId = null,
    sectorId = null,
    fullName = '',
    email = '',
    password = '',
    status = '',
    failedAttempts = 0,
    blockedUntil = null
  }) {
    this.id = id
    this.roleId = roleId
    this.sectorId = sectorId
    this.fullName = fullName
    this.email = email
    this.password = password
    this.status = status
    this.failedAttempts = failedAttempts
    this.blockedUntil = blockedUntil
  }
}
