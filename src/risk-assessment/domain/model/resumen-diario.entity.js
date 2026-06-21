export class ResumenDiario {
    constructor({ id = null, fecha = '', sectorId = null, sector = '', totalNuevos = 0, totalEnProgreso = 0, totalResueltos = 0 }) {
        Object.assign(this, { id, fecha, sectorId, sector, totalNuevos, totalEnProgreso, totalResueltos })
    }
}
