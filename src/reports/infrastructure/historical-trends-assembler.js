import { HistoricalTrends } from "@/reports/domain/model/historical-trends-entity.js";

export class HistoricalTrendsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalTrends({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('HistoricalTrends response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['historical_trends'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}