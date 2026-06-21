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
                    read = null
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
    }
}