import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class MonitoringApi extends BaseApi {
  #heatMapEndpoint
  #ticketsEndpoint
  #techniciansEndpoint
  #assetsEndpoint
  #maintenanceEndpoint
  #reportsEndpoint

  constructor() {
    super()
    this.#heatMapEndpoint = new BaseEndpoint(this, import.meta.env.VITE_HEAT_MAP_ZONES_ENDPOINT_PATH)
    this.#ticketsEndpoint = new BaseEndpoint(this, import.meta.env.VITE_TICKETS_ENDPOINT_PATH)
    this.#techniciansEndpoint = new BaseEndpoint(this, import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH)
    this.#assetsEndpoint = new BaseEndpoint(this, import.meta.env.VITE_ASSETS_ENDPOINT_PATH)
    this.#maintenanceEndpoint = new BaseEndpoint(this, import.meta.env.VITE_PREVENTIVE_MAINTENANCES_ENDPOINT_PATH)
    this.#reportsEndpoint = new BaseEndpoint(this, import.meta.env.VITE_ARCHIVED_REPORTS_ENDPOINT_PATH)
  }

  getHeatMapZones() {
    return this.#heatMapEndpoint.getAll()
  }

  getTickets() {
    return this.#ticketsEndpoint.getAll()
  }

  getTechnicians() {
    return this.#techniciansEndpoint.getAll()
  }

  getAssets() {
    return this.#assetsEndpoint.getAll()
  }

  getMaintenances() {
    return this.#maintenanceEndpoint.getAll()
  }

  getReports() {
    return this.#reportsEndpoint.getAll()
  }

  updateTicket(ticket) {
    return this.#ticketsEndpoint.update(ticket.id, ticket)
  }

  createSector(sector) {
    return this.#heatMapEndpoint.create(sector)
  }

  updateSector(sector) {
    return this.#heatMapEndpoint.update(sector.id, sector)
  }

  createTechnician(technician) {
    return this.#techniciansEndpoint.create(technician)
  }

  updateTechnician(technician) {
    return this.#techniciansEndpoint.update(technician.id, technician)
  }

  createAsset(asset) {
    return this.#assetsEndpoint.create(asset)
  }

  updateAsset(asset) {
    return this.#assetsEndpoint.update(asset.id, asset)
  }

  createMaintenance(resource) {
    return this.#maintenanceEndpoint.create(resource)
  }

  updateMaintenance(resource) {
    return this.#maintenanceEndpoint.update(resource.id, resource)
  }
}
