export class HistoricalIncidentRecords {
    constructor({
                    id = null,
                    monthly_report_id = null,
                    date = null,
                    section = null,
                    incident_type = null,
                    description = null,
                    resolved = null,
                    closing_date = null,
                    resolution_time_hours = null,
                    criticality = null,
                    operator_id = null
                }) {
        this.id = id;
        this.monthly_report_id = monthly_report_id;
        this.date = date;
        this.section = section;
        this.incident_type = incident_type;
        this.description = description;
        this.resolved = resolved;
        this.closing_date = closing_date;
        this.resolution_time_hours = resolution_time_hours;
        this.criticality = criticality;
        this.operator_id = operator_id;
    }
}