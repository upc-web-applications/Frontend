import { TicketAccionCorrectiva } from '@/mitigation/domain/model/ticket-accion-correctiva.entity.js'
export class TicketAccionCorrectivaAssembler {
    static toEntityFromResource(r) {
        return new TicketAccionCorrectiva({
            id: r.id,
            ticketNumber: r.ticketNumber,
            reporteId: r.reportId,
            sectorId: r.sectorId,
            sector: r.sector,
            tipoRiesgo: r.riskType,
            nivelCriticidad: r.criticalityLevel,
            estado: r.status,
            instrucciones: r.instructions,
            tecnicoAsignadoId: r.assignedTechnicianId,
            tecnicoNombre: r.technicianName,
            fechaCreacion: r.createdDate,
            fechaCierre: r.closureDate,
            slaLimiteHoras: r.slaLimitHours,
            slaIncumplido: r.slaMissed
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['tickets'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
