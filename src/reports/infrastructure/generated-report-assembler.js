import { GeneratedReportEntity } from "@/reports/domain/model/generated-report-entity.js";

export class GeneratedReportAssembler {
    static toEntityFromResource(resource) {
        return new GeneratedReportEntity({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('GeneratedReport response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['generated_reports'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}