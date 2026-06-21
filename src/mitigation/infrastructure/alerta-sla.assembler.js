import { AlertaSLA } from '@/mitigation/domain/model/alerta-sla.entity.js'
export class AlertaSLAAssembler {
    static toEntityFromResource(r) { return new AlertaSLA({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['alertas']
        return data.map(r => this.toEntityFromResource(r))
    }
}
