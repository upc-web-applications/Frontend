/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessment {
    constructor({ id=null, codigo='', sector='', tipoPeligro='', descripcion='', probabilidad=1, severidad=1, nivelRiesgo='Bajo', medidasControl='', estado='Pendiente', fechaEvaluacion='', usuarioId=null }) {
        Object.assign(this, { id, codigo, sector, tipoPeligro, descripcion, probabilidad, severidad, nivelRiesgo, medidasControl, estado, fechaEvaluacion, usuarioId })
    }
}
