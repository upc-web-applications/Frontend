const MATRIZ_IPERC = {
    1: { 1: 'Bajo', 2: 'Bajo', 3: 'Medio', 4: 'Alto', 5: 'Alto' },
    2: { 1: 'Bajo', 2: 'Medio', 3: 'Medio', 4: 'Alto', 5: 'Critico' },
    3: { 1: 'Medio', 2: 'Medio', 3: 'Alto', 4: 'Alto', 5: 'Critico' },
    4: { 1: 'Medio', 2: 'Alto', 3: 'Alto', 4: 'Critico', 5: 'Critico' },
    5: { 1: 'Alto', 2: 'Alto', 3: 'Critico', 4: 'Critico', 5: 'Critico' }
}

const COLORES = { Bajo: '#22c55e', Medio: '#f59e0b', Alto: '#ef4444', Critico: '#dc2626' }

export class MotorIPERC {
    calcularNivel(probIdx, sevIdx) {
        const p = Math.max(1, Math.min(5, parseInt(probIdx) || 1))
        const s = Math.max(1, Math.min(5, parseInt(sevIdx) || 1))
        return MATRIZ_IPERC[p][s]
    }

    obtenerColor(nivel) { return COLORES[nivel] ?? '#6b7280' }

    validarRango(valor) { return valor >= 1 && valor <= 5 }

    detectarPatronRecurrencia(evaluaciones, sectorId, dias = 30) {
        const ahora = new Date()
        const ventana = new Date(ahora.getTime() - dias * 86400000)
        const delSector = evaluaciones.filter(e => e.sector === sectorId || e.sectorId === sectorId)
        const filtradas = delSector.filter(e => new Date(e.fechaEvaluacion) >= ventana)
        const agrupadas = {}
        for (const ev of filtradas) {
            const key = `${ev.tipoPeligro}|${ev.descripcion}`
            if (!agrupadas[key]) agrupadas[key] = []
            agrupadas[key].push(ev)
        }
        return Object.entries(agrupadas)
            .filter(([, list]) => list.length >= 3)
            .map(([key, list]) => ({
                tipoPeligro: key.split('|')[0],
                descripcion: key.split('|')[1],
                frecuencia: list.length,
                evaluaciones: list.sort((a, b) => new Date(b.fechaEvaluacion) - new Date(a.fechaEvaluacion))
            }))
    }

    calcularCriticidadArea(evaluaciones, sectorId) {
        const delSector = evaluaciones.filter(e => e.sector === sectorId || e.sectorId === sectorId)
        if (!delSector.length) return { nivelCriticidad: 'Tolerable', intensidadMapa: 'baja' }
        const pesos = { Bajo: 1, Medio: 2, Alto: 3, Critico: 4 }
        const promedio = delSector.reduce((s, e) => s + (pesos[e.nivelRiesgo] || 1), 0) / delSector.length
        if (promedio >= 3.5) return { nivelCriticidad: 'Critico', intensidadMapa: 'muy_alta' }
        if (promedio >= 2.5) return { nivelCriticidad: 'Importante', intensidadMapa: 'alta' }
        if (promedio >= 1.5) return { nivelCriticidad: 'Moderado', intensidadMapa: 'media' }
        return { nivelCriticidad: 'Tolerable', intensidadMapa: 'baja' }
    }
}
