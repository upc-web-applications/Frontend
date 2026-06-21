export class AnnualOHSPlan {
    constructor({
                    id = null,
                    year = null,
                    global_compliance = null,
                    goal = null,
                    completed_activities = null,
                    total_activities = null,
                    critical_months = null,
                    update_date = null,
                    monthly_details = [],
                    details_by_sector = [],
                    next_review = null
                }) {
        this.id = id;
        this.year = year;
        this.global_compliance = global_compliance;
        this.goal = goal;
        this.completed_activities = completed_activities;
        this.total_activities = total_activities;
        this.critical_months = critical_months;
        this.update_date = update_date;
        this.monthly_details = monthly_details;
        this.details_by_sector = details_by_sector;
        this.next_review = next_review;
    }
}