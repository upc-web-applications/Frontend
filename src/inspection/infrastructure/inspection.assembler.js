import { Inspection } from '@/inspection/domain/model/inspection.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class InspectionAssembler {
    static #incidentTypeFromResource(incidentType) {
        return {
            'Unsafe condition': 'Condicion insegura',
            'Near-miss': 'Casi-accidente',
            'Equipment failure': 'Falla de equipo',
            'Ergonomic risk': 'Riesgo ergonomico',
            'Chemical risk': 'Riesgo quimico',
            Other: 'Otro'
        }[incidentType] ?? incidentType
    }

    static #incidentTypeToResource(incidentType) {
        return {
            'Condicion insegura': 'Unsafe condition',
            'Casi-accidente': 'Near-miss',
            'Falla de equipo': 'Equipment failure',
            'Riesgo ergonomico': 'Ergonomic risk',
            'Riesgo quimico': 'Chemical risk',
            Otro: 'Other'
        }[incidentType] ?? incidentType
    }

    static #statusFromResource(status) {
        return {
            Pending: 'Pendiente',
            InProgress: 'En revision',
            Completed: 'Resuelto',
            Cancelled: 'Cancelada',
            Recibido: 'Recibido',
            'Convertido a ticket': 'Convertido a ticket',
            'No procede': 'No procede'
        }[status] ?? status ?? 'Pendiente'
    }

    static #statusToResource(status) {
        return {
            Recibido: 'Pending',
            Pendiente: 'Pending',
            'En revision': 'InProgress',
            'Convertido a ticket': 'InProgress',
            'No procede': 'Completed',
            Cancelada: 'Cancelled',
            Resuelto: 'Completed'
        }[status] ?? status ?? 'Pending'
    }

    static #urgencyFromResource(urgency) {
        return { Critical: 'Alto', High: 'Alto', Medium: 'Medio', Low: 'Bajo' }[urgency] ?? urgency
    }

    static #urgencyToResource(urgency) {
        return { Alto: 'High', Medio: 'Medium', Bajo: 'Low' }[urgency] ?? urgency
    }

    static toEntityFromResource(r) {
        return new Inspection({
            id: r.id,
            ticket: r.ticket,
            tipoIncidente: this.#incidentTypeFromResource(r.incidentType),
            areaId: r.areaId,
            sedeId: r.headquartersId,
            activoId: r.assetId,
            nivelUrgencia: this.#urgencyFromResource(r.urgencyLevel),
            descripcion: r.description,
            estado: this.#statusFromResource(r.status),
            fotoUrl: r.photoUrl,
            operarioId: r.operatorId,
            fechaReporte: r.reportDate,
            fechaActualizacion: r.updateDate,
            accionCorrectiva: r.correctiveAction
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            ticket: entity.ticket,
            incidentType: this.#incidentTypeToResource(entity.tipoIncidente),
            areaId: entity.areaId,
            headquartersId: entity.sedeId,
            assetId: entity.activoId,
            urgencyLevel: this.#urgencyToResource(entity.nivelUrgencia),
            description: entity.descripcion,
            status: this.#statusToResource(entity.estado),
            photoUrl: entity.fotoUrl,
            operatorId: entity.operarioId,
            reportDate: entity.fechaReporte,
            updateDate: entity.fechaActualizacion,
            correctiveAction: entity.accionCorrectiva
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['inspecciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
