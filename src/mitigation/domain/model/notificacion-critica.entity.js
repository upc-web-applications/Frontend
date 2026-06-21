export class NotificacionCritica {
    constructor({ id = null, ticketId = null, supervisorId = null, supervisorNombre = '', mensaje = '', enviada = false, fechaEnvio = '' }) {
        Object.assign(this, { id, ticketId, supervisorId, supervisorNombre, mensaje, enviada, fechaEnvio })
    }
}
