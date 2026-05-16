/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import axios from 'axios'

export class BaseApi {
    #http

    constructor() {
        this.#http = axios.create({
            baseURL: 'https://my-json-server.typicode.com/upc-web-applications/riskguard-inspection-headquarters-api',
            headers: { 'Content-Type': 'application/json' }
        })
    }

    get http() { return this.#http }
}
