import { MonthlyReportEntity } from "@/reports/domain/model/monthly-report-entity.js";

export class MonthlyReportAssembler {
    static toEntityFromResource(resource) {
        return new MonthlyReportEntity({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('MonthlyReport response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['monthly_reports'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}