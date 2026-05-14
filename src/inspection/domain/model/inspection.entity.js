/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class Inspection {
    constructor({ id=null,ticket='',tipoIncidente='',areaId=null,sedeId=null,activoId=null,nivelUrgencia='Medio',descripcion='',estado='Pendiente',fotoUrl=null,operarioId=null,fechaReporte='',fechaActualizacion='',accionCorrectiva=null }) {
        Object.assign(this, { id,ticket,tipoIncidente,areaId,sedeId,activoId,nivelUrgencia,descripcion,estado,fotoUrl,operarioId,fechaReporte,fechaActualizacion,accionCorrectiva })
    }
}
