import { NotificacionCritica } from '@/mitigation/domain/model/notificacion-critica.entity.js'
export class NotificacionCriticaAssembler {
    static toEntityFromResource(r) { return new NotificacionCritica({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['notificaciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
