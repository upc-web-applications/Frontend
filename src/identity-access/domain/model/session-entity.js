export class Session {
  constructor({
    id = null,
    userId = null,
    token = '',
    createdAt = '',
    lastActivityAt = '',
    isValid = false,
    closedAt = null,
    closeReason = ''
  }) {
    this.id = id
    this.userId = userId
    this.token = token
    this.createdAt = createdAt
    this.lastActivityAt = lastActivityAt
    this.isValid = isValid
    this.closedAt = closedAt
    this.closeReason = closeReason
  }
}
