/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class Mitigation {
    constructor({ id=null, riskAssessmentId=null, codigo='', descripcion='', responsable='', fechaAsignacion='', fechaEjecucion='', estado='Pendiente', resultado='', observaciones='' }) {
        Object.assign(this, { id, riskAssessmentId, codigo, descripcion, responsable, fechaAsignacion, fechaEjecucion, estado, resultado, observaciones })
    }
}
