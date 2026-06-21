export class Ticket {
  constructor({
    id = null,
    code = '',
    heatMapId = null,
    sector = '',
    incidentType = '',
    riskLevel = '',
    assignedTechnician = '',
    assetName = '',
    requiredSpecialty = '',
    assignmentDetails = '',
    status = '',
    elapsedTime = '',
    slaStatus = '',
    description = '',
    generatedAt = ''
  }) {
    this.id = id
    this.code = code
    this.heatMapId = heatMapId
    this.sector = sector
    this.incidentType = incidentType
    this.riskLevel = riskLevel
    this.assignedTechnician = assignedTechnician
    this.assetName = assetName
    this.requiredSpecialty = requiredSpecialty
    this.assignmentDetails = assignmentDetails
    this.status = status
    this.elapsedTime = elapsedTime
    this.slaStatus = slaStatus
    this.description = description
    this.generatedAt = generatedAt
  }
}
