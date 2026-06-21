export class Asset {
  constructor({
    id = null,
    name = '',
    code = '',
    brand = '',
    sector = '',
    riskLevel = '',
    lastReview = '',
    status = ''
  }) {
    this.id = id
    this.name = name
    this.code = code
    this.brand = brand
    this.sector = sector
    this.riskLevel = riskLevel
    this.lastReview = lastReview
    this.status = status
  }
}
