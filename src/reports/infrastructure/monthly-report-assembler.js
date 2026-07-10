import { MonthlyReportEntity } from "@/reports/domain/model/monthly-report-entity.js";

export class MonthlyReportAssembler {
    static toEntityFromResource(resource) {
        return new MonthlyReportEntity({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['monthly_reports'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}