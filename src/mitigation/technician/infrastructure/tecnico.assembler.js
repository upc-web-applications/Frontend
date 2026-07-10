import { Tecnico } from '@/mitigation/technician/domain/model/tecnico.entity.js'
export class TecnicoAssembler {
    static toEntityFromResource(r) {
        return new Tecnico({
            id: r.id,
            numeroDocumento: r.documentNumber,
            nombreCompleto: r.fullName,
            especialidad: r.specialty,
            telefono: r.phone,
            email: r.email,
            estado: r.status
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['tecnicos'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
