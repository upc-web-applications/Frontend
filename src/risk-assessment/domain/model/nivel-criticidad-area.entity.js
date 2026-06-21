export class NivelCriticidadArea {
    constructor({ id = null, sectorId = null, sector = '', nivelCriticidad = 'Tolerable', intensidadMapa = 'baja', ultimaActualizacion = '' }) {
        Object.assign(this, { id, sectorId, sector, nivelCriticidad, intensidadMapa, ultimaActualizacion })
    }
}
