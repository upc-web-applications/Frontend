export class CriticalAlerts {
    constructor({
                    id = null,
                    creation_date = null,
                    type = null,
                    sector = null,
                    risk_type = null,
                    elapsed_hours = null,
                    responsible_supervisor = null,
                    status = null,
                    message = null,
                    read = null,
                    time_label = null,
                    source_ticket_id = null,
                    source_module = null
                }) {
        this.id = id;
        this.creation_date = creation_date;
        this.type = type;
        this.sector = sector;
        this.risk_type = risk_type;
        this.elapsed_hours = elapsed_hours;
        this.responsible_supervisor = responsible_supervisor;
        this.status = status;
        this.message = message;
        this.read = read;
        this.time_label = time_label;
        this.source_ticket_id = source_ticket_id;
        this.source_module = source_module;
    }
}
