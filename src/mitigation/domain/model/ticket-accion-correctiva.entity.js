export class TicketAccionCorrectiva {
    constructor({ id = null, ticketNumber = null, reporteId = null, sectorId = null, sector = '', tipoRiesgo = '', nivelCriticidad = '', estado = 'Pendiente', instrucciones = '', tecnicoAsignadoId = null, tecnicoNombre = '', fechaCreacion = '', fechaCierre = '', slaLimiteHoras = 48, slaIncumplido = false }) {
        Object.assign(this, { id, ticketNumber, reporteId, sectorId, sector, tipoRiesgo, nivelCriticidad, estado, instrucciones, tecnicoAsignadoId, tecnicoNombre, fechaCreacion, fechaCierre, slaLimiteHoras, slaIncumplido })
    }
}
