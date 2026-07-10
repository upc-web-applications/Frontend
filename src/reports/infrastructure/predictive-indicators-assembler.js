import { PredictiveIndicators } from "@/reports/domain/model/predective-indicators-entity.js";

export class PredictiveIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new PredictiveIndicators({
            id: resource.id,
            calculation_date: resource.calculation_date,
            period_days: resource.period_days,
            total_incidents: resource.total_incidents,
            previous_month_variation: resource.previous_month_variation,
            average_resolution_time_hours: resource.average_resolution_time_hours,
            resolution_goal_hours: resource.resolution_goal_hours,
            sectors_with_increasing_trend: resource.sectors_with_increasing_trend,
            recurring_incident_types: resource.recurring_incident_types,
            resolution_time_by_type: resource.resolution_time_by_type
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['predictive_indicators'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}