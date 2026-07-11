import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { HeatMapAssembler } from '@/monitoring-dashboard/infrastructure/heat-map.assembler.js'
import { TicketAssembler } from '@/monitoring-dashboard/infrastructure/ticket.assembler.js'
import { TechnicianAssembler } from '@/monitoring-dashboard/infrastructure/technician.assembler.js'
import { AssetAssembler } from '@/monitoring-dashboard/infrastructure/asset.assembler.js'
import { PreventiveMaintenanceAssembler } from '@/monitoring-dashboard/infrastructure/preventive-maintenance.assembler.js'

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
    return this.#ticketsEndpoint.update(ticket.id, TicketAssembler.toResourceFromEntity(ticket))
  }

  createSector(sector) {
    return this.#heatMapEndpoint.create(HeatMapAssembler.toResourceFromEntity(sector))
  }

  updateSector(sector) {
    return this.#heatMapEndpoint.update(sector.id, HeatMapAssembler.toResourceFromEntity(sector))
  }

  createTechnician(technician) {
    return this.#techniciansEndpoint.create(TechnicianAssembler.toResourceFromEntity(technician))
  }

  updateTechnician(technician) {
    return this.#techniciansEndpoint.update(technician.id, TechnicianAssembler.toResourceFromEntity(technician))
  }

  createAsset(asset) {
    return this.#assetsEndpoint.create(AssetAssembler.toResourceFromEntity(asset))
  }

  updateAsset(asset) {
    return this.#assetsEndpoint.update(asset.id, AssetAssembler.toResourceFromEntity(asset))
  }

  createMaintenance(resource) {
    return this.#maintenanceEndpoint.create(PreventiveMaintenanceAssembler.toResourceFromEntity(resource))
  }

  updateMaintenance(resource) {
    return this.#maintenanceEndpoint.update(resource.id, PreventiveMaintenanceAssembler.toResourceFromEntity(resource))
  }
}
