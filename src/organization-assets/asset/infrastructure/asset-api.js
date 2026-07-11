import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { AssetAssembler } from '@/organization-assets/asset/infrastructure/asset.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AssetApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/assets') }
    getAssets()            { return this.#ep.getAll() }
    getAssetById(id)       { return this.#ep.getById(id) }
    getByAreaId(aId)        { return this.http.get(`${this.#ep.endpointPath}/by-area/${aId}`) }
    createAsset(r)         { return this.#ep.create(AssetAssembler.toResourceFromEntity(r)) }
    updateAsset(r)         { return this.#ep.update(r.id, AssetAssembler.toResourceFromEntity(r)) }
    deleteAsset(id)        { return this.#ep.delete(id) }
}
