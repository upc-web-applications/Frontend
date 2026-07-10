import { HistoricalTrends } from "@/reports/domain/model/historical-trends-entity.js";

export class HistoricalTrendsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalTrends({
            id: resource.id,
            month: resource.month,
            year: resource.year,
            total_incidents: resource.total_incidents,
            incidents_by_type: resource.incidents_by_type,
            incidents_by_sector: resource.incidents_by_sector
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['historical_trends'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}