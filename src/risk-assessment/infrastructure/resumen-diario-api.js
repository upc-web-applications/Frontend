import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { ResumenDiarioAssembler } from '@/risk-assessment/infrastructure/resumen-diario.assembler.js'
export class ResumenDiarioApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/daily-summaries') }
    getAll()            { return this.#ep.getAll() }
    getById(id)         { return this.#ep.getById(id) }
    getBySectorId(sId)  { return this.#ep.getByParam('sector', sId) }
    getByFecha(f)       { return this.#ep.getByParam('date', f) }
    create(r)           { return this.#ep.create(ResumenDiarioAssembler.toResourceFromEntity(r)) }
    update(r)           { return this.#ep.update(r.id, ResumenDiarioAssembler.toResourceFromEntity(r)) }
    delete(id)          { return this.#ep.delete(id) }
}
