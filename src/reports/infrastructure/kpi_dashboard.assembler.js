import { KPIDashboard } from "@/reports/domain/model/kpi-dashboard-entity.js";

export class KPIDashboardAssembler {
    static toEntityFromResource(resource) {
        return new KPIDashboard({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('KPIDashboard response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['kpi_dashboard'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}