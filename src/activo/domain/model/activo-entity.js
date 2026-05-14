export class Activo {
    constructor({ id=null,codigo='',nombre='',descripcion='',tipo='Maquinaria',areaId=null,sedeId=null,estado='Activo',fechaAdquisicion='',ultimoMantenimiento='' }) {
        Object.assign(this, { id,codigo,nombre,descripcion,tipo,areaId,sedeId,estado,fechaAdquisicion,ultimoMantenimiento })
    }
}
