import { PredictiveIndicators } from "@/reports/domain/model/predective-indicators-entity.js";

export class PredictiveIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new PredictiveIndicators({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('PredictiveIndicators response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['predictive_indicators'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}