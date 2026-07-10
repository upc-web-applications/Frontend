import { CriticalAlerts } from "@/reports/domain/model/critical-alerts-entity.js";

export class CriticalAlertsAssembler {
    static toEntityFromResource(resource) {
        return new CriticalAlerts({
            id: resource.id,
            creation_date: resource.creation_date,
            type: resource.type,
            sector: resource.sector,
            risk_type: resource.risk_type,
            elapsed_hours: resource.elapsed_hours,
            responsible_supervisor: resource.responsible_supervisor,
            status: resource.status,
            message: resource.message,
            read: resource.read,
            time_label: resource.time_label,
            source_ticket_id: resource.source_ticket_id,
            source_module: resource.source_module
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['critical_alerts'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}