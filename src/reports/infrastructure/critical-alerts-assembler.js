import { CriticalAlerts } from "@/reports/domain/model/critical-alerts-entity.js";

export class CriticalAlertsAssembler {
    static toEntityFromResource(resource) {
        return new CriticalAlerts({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('CriticalAlerts response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['critical_alerts'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}