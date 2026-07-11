export class MonthlyReportEntity {
    constructor({
                    id = null,
                    month = null,
                    year = null,
                    total_incidents = 0,
                    resolved_incidents = 0,
                    compliance_percentage = 0,
                    status = 'draft',
                    generated_at = null
                }) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.total_incidents = total_incidents;
        this.resolved_incidents = resolved_incidents;
        this.compliance_percentage = compliance_percentage;
        this.status = status;
        this.generated_at = generated_at;
    }
}
