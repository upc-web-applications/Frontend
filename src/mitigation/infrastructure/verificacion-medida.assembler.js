import { VerificacionMedida } from '@/mitigation/domain/model/verificacion-medida.entity.js'
export class VerificacionMedidaAssembler {
    static toEntityFromResource(r) {
        return new VerificacionMedida({
            id: r.id,
            ticketId: r.ticketId,
            supervisorId: r.supervisorId,
            supervisorNombre: r.supervisorName,
            veredicto: r.verdict,
            comentarioJustificacion: r.justificationComment,
            fechaVerificacion: r.verificationDate
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['verificaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
