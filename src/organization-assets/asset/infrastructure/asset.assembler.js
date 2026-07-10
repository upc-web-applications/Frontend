import { Asset } from '@/organization-assets/asset/domain/model/asset.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AssetAssembler {
    static toEntityFromResource(r) { return new Asset({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['activos']
        return data.map(r => this.toEntityFromResource(r))
    }
}
