export class HistoricalTrends {
    constructor({
                    id = null,
                    month = null,
                    year = null,
                    total_incidents = null,
                    incidents_by_type = {},
                    incidents_by_sector = {}
                }) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.total_incidents = total_incidents;
        this.incidents_by_type = incidents_by_type;
        this.incidents_by_sector = incidents_by_sector;
    }
}