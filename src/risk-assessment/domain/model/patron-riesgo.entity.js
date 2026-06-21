export class PatronRiesgo {
    constructor({ id = null, sectorId = null, sector = '', tipoIncidente = '', tipoPeligro = '', descripcion = '', frecuencia = 0, fechaPrimeraOcurrencia = '', periodoAnalisisDias = 30, revisada = false, fechaRevision = '', revisadoPor = null }) {
        Object.assign(this, { id, sectorId, sector, tipoIncidente, tipoPeligro, descripcion, frecuencia, fechaPrimeraOcurrencia, periodoAnalisisDias, revisada, fechaRevision, revisadoPor })
    }
}
