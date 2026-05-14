/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class Hazard {
    constructor({ id=null, codigo='', nombre='', tipo='', descripcion='', nivelRiesgoBase='Medio', estado='Activo' }) {
        Object.assign(this, { id, codigo, nombre, tipo, descripcion, nivelRiesgoBase, estado })
    }
}
