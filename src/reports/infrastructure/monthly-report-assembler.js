import { MonthlyReportEntity } from "@/reports/domain/model/monthly-report-entity.js";

export class MonthlyReportAssembler {
    static toEntityFromResource(resource) {
        return new MonthlyReportEntity({
            id: resource.id,
            month: resource.month,
            year: resource.year,
            total_incidents: resource.total_incidents,
            resolved_incidents: resource.resolved_incidents,
            compliance_percentage: resource.compliance_percentage,
            status: resource.status,
            generated_at: resource.generated_at
        });
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            month: entity.month,
            year: entity.year,
            total_incidents: entity.total_incidents,
            resolved_incidents: entity.resolved_incidents,
            compliance_percentage: entity.compliance_percentage,
            status: entity.status,
            generated_at: entity.generated_at
        };
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['monthly_reports'] : null)) ?? [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
