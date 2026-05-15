export class AccessLog {
  constructor({
    id = null,
    userId = null,
    email = '',
    attemptAt = '',
    wasSuccessful = false,
    ipAddress = '',
    failureReason = ''
  }) {
    this.id = id
    this.userId = userId
    this.email = email
    this.attemptAt = attemptAt
    this.wasSuccessful = wasSuccessful
    this.ipAddress = ipAddress
    this.failureReason = failureReason
  }
}
