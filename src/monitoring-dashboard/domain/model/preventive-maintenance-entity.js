export class PreventiveMaintenance {
  constructor({
    id = null,
    assetId = null,
    assetName = '',
    technician = '',
    scheduledDate = '',
    reactivationDate = '',
    description = '',
    status = '',
    createdAt = ''
  }) {
    this.id = id
    this.assetId = assetId
    this.assetName = assetName
    this.technician = technician
    this.scheduledDate = scheduledDate
    this.reactivationDate = reactivationDate
    this.description = description
    this.status = status
    this.createdAt = createdAt
  }
}
