import { CumulativeSTIndicators } from "@/reports/domain/model/cumulative-st-indicators-entity.js";

export class CumulativeSTIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new CumulativeSTIndicators({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['cumulative_st_indicators'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}