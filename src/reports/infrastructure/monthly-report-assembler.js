import { MonthlyReportEntity } from "@/reports/domain/model/monthly-report-entity.js";

export class MonthlyReportAssembler {
    static toEntityFromResource(resource) {
        return new MonthlyReportEntity({
            id: resource.id,
            evaluated_month: resource.evaluated_month,
            evaluated_year: resource.evaluated_year,
            site_area_id: resource.site_area_id,
            general_status: resource.general_status,
            creation_date: resource.creation_date,
            update_date: resource.update_date
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['monthly_reports'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}