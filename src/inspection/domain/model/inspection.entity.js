/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class Inspection {
    constructor({ id=null,ticket='',tipoIncidente='',areaId=null,sedeId=null,activoId=null,nivelUrgencia='Medio',descripcion='',estado='Recibido',fotoUrl=null,operarioId=null,fechaReporte='',fechaActualizacion='',accionCorrectiva=null,prioridadAtencion='Media',slaSugeridoHoras=24,entradaEvaluacionRiesgo='' }) {
        Object.assign(this, { id,ticket,tipoIncidente,areaId,sedeId,activoId,nivelUrgencia,descripcion,estado,fotoUrl,operarioId,fechaReporte,fechaActualizacion,accionCorrectiva,prioridadAtencion,slaSugeridoHoras,entradaEvaluacionRiesgo })
    }
}
