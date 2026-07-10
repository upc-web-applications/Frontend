import { Site } from '@/organization-assets/site/domain/model/site.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class SiteAssembler {
    static toEntityFromResource(r) {
        return new Site({
            id: r.id,
            nombre: r.name,
            direccion: r.address,
            telefono: r.phone,
            email: r.email,
            estado: r.status,
            fechaCreacion: r.createdAt
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['sedes'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
