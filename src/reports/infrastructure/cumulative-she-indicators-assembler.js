import { CumulativeSTIndicators } from "@/reports/domain/model/cumulative-st-indicators-entity.js";

export class CumulativeSTIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new CumulativeSTIndicators({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('CumulativeSTIndicators response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['cumulative_st_indicators'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}