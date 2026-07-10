import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AssetApi } from '@/organization-assets/asset/infrastructure/asset-api.js'
import { AssetAssembler } from '@/organization-assets/asset/infrastructure/asset.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
const api = new AssetApi()
export const useAssetStore = defineStore('asset', () => {
    const assets = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getAssets().then(r => { assets.value = AssetAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return assets.value.find(a => a.id === parseInt(id)) }
    function getByAreaId(aId) { return assets.value.filter(a => a.areaId === parseInt(aId) && a.estado === 'Activo') }
    function add(asset) { return api.createAsset(asset).then(r => assets.value.push(AssetAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(asset) { return api.updateAsset(asset).then(r => { const u = AssetAssembler.toEntityFromResource(r.data); const i = assets.value.findIndex(a => a.id === u.id); if (i !== -1) assets.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteAsset(id).then(() => { const i = assets.value.findIndex(a => a.id === id); if (i !== -1) assets.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { assets, errors, loaded, fetchAll, getById, getByAreaId, add, update, remove }
})
