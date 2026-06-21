/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class Area {
    constructor({ id=null,nombre='',codigo='',descripcion='',sedeId=null,estado='Activo',nivelRiesgo='Medio',fechaCreacion='' }) {
        Object.assign(this, { id,nombre,codigo,descripcion,sedeId,estado,nivelRiesgo,fechaCreacion })
    }
}
