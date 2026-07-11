import { CumulativeSTIndicators } from "@/reports/domain/model/cumulative-st-indicators-entity.js";

export class CumulativeSTIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new CumulativeSTIndicators({
            id: resource.id,
            name: resource.name,
            description: resource.description,
            total_incidents: resource.total_incidents,
            resolved_incidents: resource.resolved_incidents,
            compliance_rate: resource.compliance_rate,
            period: resource.period
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['cumulative_st_indicators'] : null)) ?? [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
