import { TicketAccionCorrectiva } from '@/mitigation/domain/model/ticket-accion-correctiva.entity.js'
export class TicketAccionCorrectivaAssembler {
    static #statusFromResource(status) { return { Open: 'Asignado', Pending: 'Asignado', InProgress: 'En ejecucion', MitigationReported: 'Mitigacion reportada', VerificationPending: 'En verificacion', Closed: 'Cerrado', Reopened: 'Reabierto', Resolved: 'Cerrado' }[status] ?? status }
    static #statusToResource(status) { return { Asignado: 'Open', 'En ejecucion': 'InProgress', 'Mitigacion reportada': 'MitigationReported', 'En verificacion': 'VerificationPending', Cerrado: 'Closed', Reabierto: 'Reopened' }[status] ?? status }

    static toEntityFromResource(r) {
        return new TicketAccionCorrectiva({
            id: r.id,
            ticketNumber: r.ticketNumber ?? 0,
            reporteId: r.reportId,
            sectorId: r.sectorId,
            sector: r.sector ?? '',
            tipoRiesgo: r.riskType ?? '',
            nivelCriticidad: r.criticalityLevel ?? '',
            estado: this.#statusFromResource(r.status ?? 'Pending'),
            instrucciones: r.instructions ?? '',
            tecnicoAsignadoId: r.assignedTechnicianId,
            tecnicoNombre: r.technicianName ?? '',
            fechaCreacion: r.createdDate ?? r.createdAt ?? new Date().toISOString(),
            fechaCierre: r.closureDate,
            slaLimiteHoras: r.slaLimitHours,
            slaIncumplido: r.slaMissed
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            ticketNumber: entity.ticketNumber,
            reportId: entity.reporteId,
            sectorId: entity.sectorId,
            sector: entity.sector,
            riskType: entity.tipoRiesgo,
            criticalityLevel: entity.nivelCriticidad,
            status: this.#statusToResource(entity.estado),
            instructions: entity.instrucciones,
            assignedTechnicianId: entity.tecnicoAsignadoId,
            technicianName: entity.tecnicoNombre,
            createdDate: entity.fechaCreacion,
            closureDate: entity.fechaCierre,
            slaLimitHours: entity.slaLimiteHoras,
            slaMissed: entity.slaIncumplido
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['tickets'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
