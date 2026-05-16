/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import axios from 'axios'

export class BaseApi {
    #http

    constructor() {
        this.#http = axios.create({
            baseURL: import.meta.env.VITE_RISKGUARD_API_URL,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    get http() { return this.#http }
}
