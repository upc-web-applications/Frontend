export class VerificacionMedida {
    constructor({ id = null, ticketId = null, supervisorId = null, supervisorNombre = '', veredicto = '', comentarioJustificacion = '', fechaVerificacion = '' }) {
        Object.assign(this, { id, ticketId, supervisorId, supervisorNombre, veredicto, comentarioJustificacion, fechaVerificacion })
    }
}
