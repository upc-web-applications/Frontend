export class CumulativeSTIndicators {
    constructor({
                    id = null,
                    monthly_report_id = null,
                    accident_rate_index = null,
                    administrative_errors_count = null,
                    processed_by = null,
                    calculation_date = null
                }) {
        this.id = id;
        this.monthly_report_id = monthly_report_id;
        this.accident_rate_index = accident_rate_index;
        this.administrative_errors_count = administrative_errors_count;
        this.processed_by = processed_by;
        this.calculation_date = calculation_date;
    }
}