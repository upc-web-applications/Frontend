export class CumulativeSTIndicators {
    constructor({
                    id = null,
                    name = '',
                    description = '',
                    total_incidents = 0,
                    resolved_incidents = 0,
                    compliance_rate = 0,
                    period = ''
                }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.total_incidents = total_incidents;
        this.resolved_incidents = resolved_incidents;
        this.compliance_rate = compliance_rate;
        this.period = period;
    }
}
