export class AlertaPatron {
    constructor({ id = null, patronId = null, sectorId = null, sector = '', tipoRiesgo = '', numeroOcurrencias = 0, fechaPrimerReporte = '', estado = 'Activa', fechaGeneracion = '' }) {
        Object.assign(this, { id, patronId, sectorId, sector, tipoRiesgo, numeroOcurrencias, fechaPrimerReporte, estado, fechaGeneracion })
    }
}
