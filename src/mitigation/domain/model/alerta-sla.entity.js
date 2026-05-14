export class AlertaSLA {
    constructor({ id = null, ticketId = null, horasTranscurridas = 0, slaLimiteHoras = 48, fechaAlerta = '', notificadoA = null, notificadoNombre = '' }) {
        Object.assign(this, { id, ticketId, horasTranscurridas, slaLimiteHoras, fechaAlerta, notificadoA, notificadoNombre })
    }
}
