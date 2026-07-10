/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class Site {
    constructor({ id=null, nombre='', direccion='', telefono='', email='', estado='Activo', fechaCreacion='' }) {
        this.id = id; this.nombre = nombre; this.direccion = direccion
        this.telefono = telefono; this.email = email; this.estado = estado; this.fechaCreacion = fechaCreacion
    }
}
