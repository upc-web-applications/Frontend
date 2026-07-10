import { CriticalAlerts } from "@/reports/domain/model/critical-alerts-entity.js";

export class CriticalAlertsAssembler {
    static toEntityFromResource(resource) {
        return new CriticalAlerts({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['critical_alerts'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}