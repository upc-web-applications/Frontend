export class Tecnico {
    constructor({ id = null, numeroDocumento = '', nombreCompleto = '', especialidad = '', telefono = '', email = '', estado = 'Activo' }) {
        Object.assign(this, { id, numeroDocumento, nombreCompleto, especialidad, telefono, email, estado })
    }
}
