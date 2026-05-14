/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class BaseEndpoint {
    constructor(baseApi, endpointPath) {
        this.http = baseApi.http
        this.endpointPath = endpointPath
    }
    getAll()              { return this.http.get(this.endpointPath) }
    getById(id)           { return this.http.get(`${this.endpointPath}/${id}`) }
    getByParam(p, v)      { return this.http.get(`${this.endpointPath}?${p}=${v}`) }
    create(resource)      { return this.http.post(this.endpointPath, resource) }
    update(id, resource)  { return this.http.put(`${this.endpointPath}/${id}`, resource) }
    delete(id)            { return this.http.delete(`${this.endpointPath}/${id}`) }
}
