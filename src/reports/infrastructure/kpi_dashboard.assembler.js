import { KPIDashboard } from "@/reports/domain/model/kpi-dashboard-entity.js";

export class KPIDashboardAssembler {
    static toEntityFromResource(resource) {
        return new KPIDashboard({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['kpi_dashboard'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}