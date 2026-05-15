export class Sector {
  constructor({
    id = null,
    type = '',
    sectorId = null,
    assetId = null,
    code = '',
    name = '',
    description = '',
    heatIndex = 0,
    riskLevel = '',
    status = '',
    updatedAt = '',
    position = ''
  }) {
    this.id = id
    this.type = type
    this.sectorId = sectorId
    this.assetId = assetId
    this.code = code
    this.name = name
    this.description = description
    this.heatIndex = heatIndex
    this.riskLevel = riskLevel
    this.status = status
    this.updatedAt = updatedAt
    this.position = position
  }
}
