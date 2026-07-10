import { GeneratedReportEntity } from "@/reports/domain/model/generated-report-entity.js";

export class GeneratedReportAssembler {
    static toEntityFromResource(resource) {
        return new GeneratedReportEntity({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['generated_reports'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}