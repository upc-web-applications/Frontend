import { CumulativeSTIndicators } from "@/reports/domain/model/cumulative-st-indicators-entity.js";

export class CumulativeSTIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new CumulativeSTIndicators({
            id: resource.id,
            monthly_report_id: resource.monthly_report_id,
            accident_rate_index: resource.accident_rate_index,
            administrative_errors_count: resource.administrative_errors_count,
            processed_by: resource.processed_by,
            calculation_date: resource.calculation_date
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