import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { MonitoringApi } from '@/monitoring-dashboard/infrastructure/monitoring-api.js'
import { HeatMapAssembler } from '@/monitoring-dashboard/infrastructure/heat-map.assembler.js'
import { TicketAssembler } from '@/monitoring-dashboard/infrastructure/ticket.assembler.js'
import { AssetAssembler } from '@/monitoring-dashboard/infrastructure/asset.assembler.js'
import { SectorAssembler } from '@/monitoring-dashboard/infrastructure/sector.assembler.js'
import { TechnicianAssembler } from '@/monitoring-dashboard/infrastructure/technician.assembler.js'
import { PreventiveMaintenanceAssembler } from '@/monitoring-dashboard/infrastructure/preventive-maintenance.assembler.js'
import { PreventiveMaintenance } from '@/monitoring-dashboard/domain/model/preventive-maintenance-entity.js'
import { Sector } from '@/monitoring-dashboard/domain/model/sector-entity.js'
import { Technician } from '@/monitoring-dashboard/domain/model/technician-entity.js'
import { Asset } from '@/monitoring-dashboard/domain/model/asset-entity.js'

const monitoringApi = new MonitoringApi()

const useMonitoringStore = defineStore('monitoring-dashboard', () => {
  const heatMapZones = ref([])
  const sectors = ref([])
  const tickets = ref([])
  const technicians = ref([])
  const assets = ref([])
  const maintenances = ref([])
  const archivedReports = ref([])
  const patterns = ref([])
  const errors = ref([])
  const selectedSector = ref(null)
  const filterRisk = ref(null)
  const filterStatus = ref(null)
  const loaded = ref(false)

  const pendingTicketsCount = computed(() => tickets.value.filter(ticket => ticket.status === 'Pendiente').length)
  const inProgressCount = computed(() => tickets.value.filter(ticket => ticket.status === 'En Progreso').length)
  const criticalAlertsCount = computed(() => tickets.value.filter(ticket => ticket.riskLevel === 'Critico' && ticket.status !== 'Cerrado').length)
  const compliancePercent = computed(() => 86)
  const totalAssetsCount = computed(() => assets.value.length)
  const totalSectorsCount = computed(() => sectors.value.length)
  const activeTechnicians = computed(() => technicians.value.filter(technician => technician.status === 'Activo'))

  const filteredTickets = computed(() => {
    return tickets.value.filter(ticket => {
      const sectorMatch = !selectedSector.value || ticket.heatMapId === selectedSector.value.id
      const riskMatch = !filterRisk.value || ticket.riskLevel === filterRisk.value
      const statusMatch = !filterStatus.value || ticket.status === filterStatus.value
      return sectorMatch && riskMatch && statusMatch
    })
  })

  function fetchDashboard() {
    return Promise.all([
      monitoringApi.getHeatMapZones(),
      monitoringApi.getTickets(),
      monitoringApi.getTechnicians(),
      monitoringApi.getAssets(),
      monitoringApi.getMaintenances(),
      monitoringApi.getReports(),
      monitoringApi.getPatterns()
    ]).then(responses => {
      heatMapZones.value = HeatMapAssembler.toEntitiesFromResponse(responses[0])
      sectors.value = SectorAssembler.toEntitiesFromResponse(responses[0])
      tickets.value = TicketAssembler.toEntitiesFromResponse(responses[1])
      technicians.value = TechnicianAssembler.toEntitiesFromResponse(responses[2])
      assets.value = AssetAssembler.toEntitiesFromResponse(responses[3])
      maintenances.value = PreventiveMaintenanceAssembler.toEntitiesFromResponse(responses[4])
      archivedReports.value = responses[5].data
      patterns.value = responses[6].data
      loaded.value = true
    }).catch(error => errors.value.push(error))
  }

  function selectSector(zone) {
    selectedSector.value = zone
  }

  function clearFilters() {
    selectedSector.value = null
    filterRisk.value = null
    filterStatus.value = null
  }

  function getTicketById(id) {
    const idNum = parseInt(id)
    return tickets.value.find(ticket => ticket.id === idNum)
  }

  function getAssetById(id) {
    const idNum = parseInt(id)
    return assets.value.find(asset => asset.id === idNum)
  }

  function getSectorById(id) {
    const idNum = parseInt(id)
    return sectors.value.find(sector => sector.id === idNum)
  }

  function getTechnicianById(id) {
    const idNum = parseInt(id)
    return technicians.value.find(technician => technician.id === idNum)
  }

  function normalizeText(value) {
    return (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  function getAssetsCountBySector(sector) {
    const sectorName = normalizeText(sector.name)
    return assets.value.filter(asset => {
      const assetSector = normalizeText(asset.sector)
      const relatedChemicalSector = sectorName.includes('quimic') && assetSector.includes('quimic')
      return assetSector.includes(sectorName) || sectorName.includes(assetSector) || relatedChemicalSector
    }).length
  }

  function getMaintenanceByAssetId(assetId) {
    const idNum = parseInt(assetId)
    return maintenances.value.find(item => item.assetId === idNum && item.status === 'En Mantenimiento')
  }

  function assignTechnician(ticket, technicianName, details, specialty) {
    const updatedTicket = {
      ...ticket,
      assignedTechnician: technicianName,
      assignmentDetails: details,
      requiredSpecialty: specialty,
      status: 'En Progreso'
    }
    return monitoringApi.updateTicket(updatedTicket).then(response => {
      const ticketEntity = TicketAssembler.toEntityFromResource(response.data)
      const index = tickets.value.findIndex(item => item.id === ticket.id)
      if (index !== -1) tickets.value[index] = ticketEntity
    }).catch(error => errors.value.push(error))
  }

  function addMaintenance(form) {
    const asset = assets.value.find(item => item.id === form.assetId)
    const maintenance = new PreventiveMaintenance({
      assetId: form.assetId,
      assetName: asset ? asset.name : '',
      technician: form.technician,
      scheduledDate: form.startDate,
      reactivationDate: form.reactivationDate,
      description: form.description,
      status: 'En Mantenimiento',
      createdAt: new Date().toISOString()
    })
    return monitoringApi.createMaintenance(maintenance).then(response => {
      maintenances.value.unshift(PreventiveMaintenanceAssembler.toEntityFromResource(response.data))
      if (asset) {
        const updatedAsset = { ...asset, status: 'Mantenimiento' }
        return updateAsset(updatedAsset)
      }
    }).catch(error => errors.value.push(error))
  }

  function addSector(form) {
    const nextId = sectors.value.length + 1
    const sector = new Sector({
      type: 'Sector',
      sectorId: nextId,
      assetId: null,
      code: `SEC-${String(nextId).padStart(3, '0')}`,
      name: form.name,
      description: form.description,
      heatIndex: 0,
      riskLevel: 'Bajo',
      status: 'Activo',
      updatedAt: new Date().toISOString(),
      position: 'wide'
    })
    return monitoringApi.createSector(sector).then(response => {
      const newSector = SectorAssembler.toEntityFromResource(response.data)
      const newHeatMapZone = HeatMapAssembler.toEntityFromResource(response.data)
      sectors.value.push(newSector)
      heatMapZones.value.push(newHeatMapZone)
    }).catch(error => errors.value.push(error))
  }

  function updateSector(sector) {
    return monitoringApi.updateSector(sector).then(response => {
      const updatedSector = SectorAssembler.toEntityFromResource(response.data)
      const updatedHeatMapZone = HeatMapAssembler.toEntityFromResource(response.data)
      const sectorIndex = sectors.value.findIndex(item => item.id === sector.id)
      const heatMapIndex = heatMapZones.value.findIndex(item => item.id === sector.id)
      if (sectorIndex !== -1) sectors.value[sectorIndex] = updatedSector
      if (heatMapIndex !== -1) heatMapZones.value[heatMapIndex] = updatedHeatMapZone
    }).catch(error => errors.value.push(error))
  }

  function buildTechnicianCode() {
    const nextId = technicians.value.length + 1
    return `TEC-${String(nextId).padStart(2, '0')}`
  }

  function addTechnician(form) {
    const technician = new Technician({
      code: buildTechnicianCode(),
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      specialty: form.specialty,
      email: form.email,
      phone: form.phone,
      status: 'Activo'
    })
    return monitoringApi.createTechnician(technician).then(response => {
      technicians.value.push(TechnicianAssembler.toEntityFromResource(response.data))
    }).catch(error => errors.value.push(error))
  }

  function updateTechnician(technician) {
    const updatedTechnician = {
      ...technician,
      fullName: `${technician.firstName} ${technician.lastName}`.trim()
    }
    return monitoringApi.updateTechnician(updatedTechnician).then(response => {
      const technicianEntity = TechnicianAssembler.toEntityFromResource(response.data)
      const index = technicians.value.findIndex(item => item.id === technician.id)
      if (index !== -1) technicians.value[index] = technicianEntity
    }).catch(error => errors.value.push(error))
  }

  function addAsset(asset) {
    const newAsset = new Asset(asset)
    return monitoringApi.createAsset(newAsset).then(response => {
      assets.value.push(AssetAssembler.toEntityFromResource(response.data))
    }).catch(error => errors.value.push(error))
  }

  function updateAsset(asset) {
    return monitoringApi.updateAsset(asset).then(response => {
      const assetEntity = AssetAssembler.toEntityFromResource(response.data)
      const index = assets.value.findIndex(item => item.id === asset.id)
      if (index !== -1) assets.value[index] = assetEntity
    }).catch(error => errors.value.push(error))
  }

  function reactivateAsset(asset) {
    const maintenance = getMaintenanceByAssetId(asset.id)
    const updatedAsset = { ...asset, status: 'Operativo' }
    const updateMaintenance = maintenance
      ? monitoringApi.updateMaintenance({ ...maintenance, status: 'Finalizado', finishedAt: new Date().toISOString() }).then(response => {
          const maintenanceEntity = PreventiveMaintenanceAssembler.toEntityFromResource(response.data)
          const index = maintenances.value.findIndex(item => item.id === maintenance.id)
          if (index !== -1) maintenances.value[index] = maintenanceEntity
        })
      : Promise.resolve()
    return updateMaintenance.then(() => updateAsset(updatedAsset))
  }

  return {
    heatMapZones,
    sectors,
    tickets,
    technicians,
    assets,
    maintenances,
    archivedReports,
    patterns,
    errors,
    selectedSector,
    filterRisk,
    filterStatus,
    loaded,
    pendingTicketsCount,
    inProgressCount,
    criticalAlertsCount,
    compliancePercent,
    totalAssetsCount,
    totalSectorsCount,
    activeTechnicians,
    filteredTickets,
    fetchDashboard,
    selectSector,
    clearFilters,
    getTicketById,
    getAssetById,
    getSectorById,
    getTechnicianById,
    getAssetsCountBySector,
    getMaintenanceByAssetId,
    assignTechnician,
    addMaintenance,
    addSector,
    updateSector,
    addTechnician,
    updateTechnician,
    addAsset,
    updateAsset,
    reactivateAsset
  }
})

export default useMonitoringStore
