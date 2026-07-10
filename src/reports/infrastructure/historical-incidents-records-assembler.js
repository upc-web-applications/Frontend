import { HistoricalIncidentRecords } from "@/reports/domain/model/historical-incidents-records-entity.js";

export class HistoricalIncidentRecordsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalIncidentRecords({
            id: resource.id,
            monthly_report_id: resource.monthly_report_id,
            date: resource.date,
            section: resource.section,
            incident_type: resource.incident_type,
            description: resource.description,
            resolved: resource.resolved,
            closing_date: resource.closing_date,
            resolution_time_hours: resource.resolution_time_hours,
            criticality: resource.criticality,
            operator_id: resource.operator_id
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['historical_incident_records'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}