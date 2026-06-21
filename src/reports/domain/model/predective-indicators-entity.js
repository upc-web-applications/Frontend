
export class PredictiveIndicators {
    constructor({
                    id = null,
                    calculation_date = null,
                    period_days = null,
                    total_incidents = null,
                    previous_month_variation = null,
                    average_resolution_time_hours = null,
                    resolution_goal_hours = null,
                    sectors_with_increasing_trend = [],
                    recurring_incident_types = [],
                    resolution_time_by_type = []
                }) {
        this.id = id;
        this.calculation_date = calculation_date;
        this.period_days = period_days;
        this.total_incidents = total_incidents;
        this.previous_month_variation = previous_month_variation;
        this.average_resolution_time_hours = average_resolution_time_hours;
        this.resolution_goal_hours = resolution_goal_hours;
        this.sectors_with_increasing_trend = sectors_with_increasing_trend;
        this.recurring_incident_types = recurring_incident_types;
        this.resolution_time_by_type = resolution_time_by_type;
    }
}