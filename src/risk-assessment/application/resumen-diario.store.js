import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ResumenDiarioApi } from '@/risk-assessment/infrastructure/resumen-diario-api.js'
import { ResumenDiarioAssembler } from '@/risk-assessment/infrastructure/resumen-diario.assembler.js'

const api = new ResumenDiarioApi()
export const useResumenDiarioStore = defineStore('resumenDiario', () => {
    const resumenes = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getAll().then(r => { resumenes.value = ResumenDiarioAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return resumenes.value.find(r => r.id === parseInt(id)) }
    function getBySectorId(sId) { return resumenes.value.filter(r => r.sectorId === parseInt(sId)) }
    function add(resumen) { return api.create(resumen).then(r => resumenes.value.push(ResumenDiarioAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function remove(id) { return api.delete(id).then(() => { const i = resumenes.value.findIndex(r => r.id === id); if (i !== -1) resumenes.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { resumenes, errors, loaded, fetchAll, getById, getBySectorId, add, remove }
})
