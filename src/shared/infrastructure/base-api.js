import axios from 'axios'

const TOKEN_KEY = 'riskguard-jwt-token'

export class BaseApi {
    #http

    constructor() {
        this.#http = axios.create({
            baseURL: import.meta.env.VITE_RISKGUARD_API_URL,
            headers: { 'Content-Type': 'application/json' }
        })

        this.#http.interceptors.request.use(config => {
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    get http() { return this.#http }

    static getToken() {
        return localStorage.getItem(TOKEN_KEY)
    }

    static setToken(token) {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }
    }

    static clearToken() {
        localStorage.removeItem(TOKEN_KEY)
    }
}
