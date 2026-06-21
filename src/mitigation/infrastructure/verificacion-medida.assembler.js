import { VerificacionMedida } from '@/mitigation/domain/model/verificacion-medida.entity.js'
export class VerificacionMedidaAssembler {
    static toEntityFromResource(r) { return new VerificacionMedida({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['verificaciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
