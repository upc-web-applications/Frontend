import { AnnualOHSPlan } from "@/reports/domain/model/annual-she-plan-entity.js";

export class AnnualOHSPlanAssembler {
    static toEntityFromResource(resource) {
        return new AnnualOHSPlan({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('AnnualOHSPlan response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['annual_ohs_plan'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}