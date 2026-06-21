import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TecnicoApi } from '@/technician/infrastructure/tecnico-api.js'
import { TecnicoAssembler } from '@/technician/infrastructure/tecnico.assembler.js'

const api = new TecnicoApi()
export const useTecnicoStore = defineStore('tecnico', () => {
    const tecnicos = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getTecnicos().then(r => { tecnicos.value = TecnicoAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return tecnicos.value.find(t => t.id === parseInt(id)) }
    function add(tecnico) { return api.createTecnico(tecnico).then(r => { const e = TecnicoAssembler.toEntityFromResource(r.data); tecnicos.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function update(tecnico) { return api.updateTecnico(tecnico).then(r => { const u = TecnicoAssembler.toEntityFromResource(r.data); const i = tecnicos.value.findIndex(t => t.id === u.id); if (i !== -1) tecnicos.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteTecnico(id).then(() => { const i = tecnicos.value.findIndex(t => t.id === id); if (i !== -1) tecnicos.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    return { tecnicos, errors, loaded, fetchAll, getById, add, update, remove }
})
