import { PredictiveIndicators } from "@/reports/domain/model/predective-indicators-entity.js";

export class PredictiveIndicatorsAssembler {
    static toEntityFromResource(resource) {
        return new PredictiveIndicators({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['predictive_indicators'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}