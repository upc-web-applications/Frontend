/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class Asset {
    constructor({ id=null,codigo='',nombre='',descripcion='',tipo='Machinery',areaId=null,sedeId=null,estado='Activo',fechaAdquisicion='',ultimoMantenimiento='' }) {
        Object.assign(this, { id,codigo,nombre,descripcion,tipo,areaId,sedeId,estado,fechaAdquisicion,ultimoMantenimiento })
    }
}
