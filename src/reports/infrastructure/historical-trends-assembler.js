import { HistoricalTrends } from "@/reports/domain/model/historical-trends-entity.js";

export class HistoricalTrendsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalTrends({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['historical_trends'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}