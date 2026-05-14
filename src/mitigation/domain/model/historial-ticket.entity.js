export class HistorialTicket {
    constructor({ id = null, ticketId = null, evento = '', usuarioId = null, usuarioNombre = '', detalles = '', fecha = '' }) {
        Object.assign(this, { id, ticketId, evento, usuarioId, usuarioNombre, detalles, fecha })
    }
}
