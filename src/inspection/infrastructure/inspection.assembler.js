import { Inspection } from '@/inspection/domain/model/inspection.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class InspectionAssembler {
    static toEntityFromResource(r) {
        return new Inspection({
            id: r.id,
            ticket: r.ticket,
            tipoIncidente: r.incidentType,
            areaId: r.areaId,
            sedeId: r.headquartersId,
            activoId: r.assetId,
            nivelUrgencia: r.urgencyLevel,
            descripcion: r.description,
            estado: r.status,
            fotoUrl: r.photoUrl,
            operarioId: r.operatorId,
            fechaReporte: r.reportDate,
            fechaActualizacion: r.updateDate,
            accionCorrectiva: r.correctiveAction
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['inspecciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
