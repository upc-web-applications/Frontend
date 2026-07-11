import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SiteApi } from '@/site/infrastructure/site-api.js'
import { SiteAssembler } from '@/site/infrastructure/site.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
const api = new SiteApi()
export const useSiteStore = defineStore('site', () => {
    const sites = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() {
        return api.getSites().then(r => { sites.value = SiteAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e))
    }
    function getById(id) { return sites.value.find(s => s.id === parseInt(id)) }
    function add(site) { return api.createSite(site).then(r => sites.value.push(SiteAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(site) { return api.updateSite(site).then(r => { const u = SiteAssembler.toEntityFromResource(r.data); const i = sites.value.findIndex(s => s.id === u.id); if (i !== -1) sites.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteSite(id).then(() => { const i = sites.value.findIndex(s => s.id === id); if (i !== -1) sites.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { sites, errors, loaded, fetchAll, getById, add, update, remove }
})
