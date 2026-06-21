/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class Mitigation {
    constructor({ id=null, riskAssessmentId=null, ticketId=null, codigo='', descripcion='', responsable='', fechaAsignacion='', fechaEjecucion='', estado='Pendiente', resultado='', observaciones='' }) {
        Object.assign(this, { id, riskAssessmentId, ticketId, codigo, descripcion, responsable, fechaAsignacion, fechaEjecucion, estado, resultado, observaciones })
    }
}
