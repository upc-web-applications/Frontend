import { AnnualOHSPlan } from "@/reports/domain/model/annual-she-plan-entity.js";

export class AnnualOHSPlanAssembler {
    static toEntityFromResource(resource) {
        return new AnnualOHSPlan({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['annual_ohs_plan'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}