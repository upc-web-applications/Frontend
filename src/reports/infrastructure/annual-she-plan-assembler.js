import { AnnualOHSPlan } from "@/reports/domain/model/annual-she-plan-entity.js";

export class AnnualOHSPlanAssembler {
    static toEntityFromResource(resource) {
        return new AnnualOHSPlan({
            id: resource.id,
            year: resource.year,
            global_compliance: resource.global_compliance,
            goal: resource.goal,
            completed_activities: resource.completed_activities,
            total_activities: resource.total_activities,
            critical_months: resource.critical_months,
            update_date: resource.update_date,
            monthly_details: resource.monthly_details,
            details_by_sector: resource.details_by_sector,
            next_review: resource.next_review
        });
    }

    static toResourceFromEntity(entity) {
        return {
            year: entity.year,
            globalCompliance: entity.global_compliance,
            goal: entity.goal,
            completedActivities: entity.completed_activities,
            totalActivities: entity.total_activities
        };
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['annual_ohs_plan'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
