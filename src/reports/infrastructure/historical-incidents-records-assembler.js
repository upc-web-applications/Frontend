import { HistoricalIncidentRecords } from "@/reports/domain/model/historical-incidents-records-entity.js";

export class HistoricalIncidentRecordsAssembler {
    static toEntityFromResource(resource) {
        return new HistoricalIncidentRecords({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        console.log('HistoricalIncidentRecords response:', response);

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data instanceof Array
            ? response.data
            : response.data['historical_incident_records'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}