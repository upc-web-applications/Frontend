import { GeneratedReportEntity } from "@/reports/domain/model/generated-report-entity.js";

export class GeneratedReportAssembler {
    static toEntityFromResource(resource) {
        return new GeneratedReportEntity({
            id: resource.id,
            type: resource.type,
            month: resource.month,
            year: resource.year,
            start_date: resource.start_date,
            end_date: resource.end_date,
            sector_filter: resource.sector_filter,
            generation_date: resource.generation_date,
            file_name: resource.file_name,
            status: resource.status,
            size_kb: resource.size_kb
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['generated_reports'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}