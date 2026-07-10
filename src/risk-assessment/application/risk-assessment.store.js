import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RiskAssessmentApi } from '@/risk-assessment/infrastructure/risk-assessment-api.js'
import { RiskAssessmentAssembler } from '@/risk-assessment/infrastructure/risk-assessment.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
const api = new RiskAssessmentApi()
export const useRiskAssessmentStore = defineStore('riskAssessment', () => {
    const assessments = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getRiskAssessments().then(r => { assessments.value = RiskAssessmentAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return assessments.value.find(a => a.id === id) }
    function getByAreaId(aId) { return assessments.value.filter(a => a.areaId === parseInt(aId)) }
    function add(assessment) { return api.createRiskAssessment(assessment).then(r => { const e = RiskAssessmentAssembler.toEntityFromResource(r.data); assessments.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function update(assessment) { return api.updateRiskAssessment(assessment).then(r => { const u = RiskAssessmentAssembler.toEntityFromResource(r.data); const i = assessments.value.findIndex(a => a.id === u.id); if (i !== -1) assessments.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteRiskAssessment(id).then(() => { const i = assessments.value.findIndex(a => a.id === id); if (i !== -1) assessments.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    return { assessments, errors, loaded, fetchAll, getById, getByAreaId, add, update, remove }
})
