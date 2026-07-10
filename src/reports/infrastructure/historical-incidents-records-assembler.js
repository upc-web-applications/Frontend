import { HistoricalIncidentRecords } from "@/reports/domain/model/historical-incidents-records-entity.js";

export class HistoricalIncidentRecordsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalIncidentRecords({ ...resource });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            return [];
        }

        let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['historical_incident_records'] : null)) ?? [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}