import { Site } from '@/organization-assets/site/domain/model/site.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class SiteAssembler {
    static toEntityFromResource(r) { return new Site({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['sedes']
        return data.map(r => this.toEntityFromResource(r))
    }
}
