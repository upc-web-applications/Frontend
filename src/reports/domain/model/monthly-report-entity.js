export class MonthlyReportEntity {
    constructor({
                    id = null,
                    evaluated_month = null,
                    evaluated_year = null,
                    site_area_id = null,
                    general_status = null,
                    creation_date = null,
                    update_date = null
                }) {
        this.id = id;
        this.evaluated_month = evaluated_month;
        this.evaluated_year = evaluated_year;
        this.site_area_id = site_area_id;
        this.general_status = general_status;
        this.creation_date = creation_date;
        this.update_date = update_date;
    }
}