// services/api.js
import {useAuthStore} from "../stores/auth.js";

class ApiService {
    constructor() {
        this.config = {
            baseUrl: 'http://localhost:2234',
            apiKey: '',
            loginEndpoint: '/auth/login',
            registerEndpoint: '/registerMe',
            processEndpoint: '/processFile',
            templatesEndpoint: '/templates'
        }

        // Load saved config
        const savedConfig = localStorage.getItem('apiSettings')
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) }
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
    }

    async requestPost(endpoint, options = {}) {
        const url = `${this.config.baseUrl}${endpoint}`
        const token = localStorage.getItem(`${options.body.email}`);

        const defaultHeaders = {
            'Content-Type': 'application/json',
        }

        if (token) {
            // defaultHeaders.Authorization = `Bearer ${token}`
            defaultHeaders['ocr-api-key'] = token;
        }

        // if (this.config.apiKey) {
        //     defaultHeaders['X-API-Key'] = this.config.apiKey
        // }

        const config = {
            headers: defaultHeaders,
            ...options,
            // headers: {
            //     ...defaultHeaders,
            //     ...options.headers
            // }
        }

        try {
            const response = await fetch(url, config)

            if (!response.ok) {
                if (response.status === 401) {
                    const authstore = useAuthStore();
                    const userEmail = authstore.userEmail;
                    // localStorage.removeItem('ocr-api-key')
                    // localStorage.removeItem('userEmail')
                    authstore.setUserEmail(null);
                    localStorage.removeItem(`${userEmail}`);
                    window.location.href = '/login'
                    // throw new Error('Session expired. Please login again.')
                }

                const errorData = await response.json().catch(() => ({}))
                // throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            console.log("response from post request is: ", response);
            return response;
        } catch (error) {
            console.error('API request failed:', error)
            throw error
        }
    }

    async requestGet(endpoint, options = {}) {
        try {
            // const queryString = new URLSearchParams(options.body).toString();
            // console.log("query string is: ", queryString);
            const token = localStorage.getItem(`${options.body.email}`);
            const url = `${endpoint}/${token}`;
            console.log("url is: ", url);
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Login API request failed:', error)
            throw error
        }
    }

    // Auth methods
    async login(credentials) {
        const response = await this.requestGet(this.config.loginEndpoint, {
            method: 'GET',
            body: JSON.stringify(credentials)
        })
        console.log("login api response is: ", response);
    }

    async register(userData) {
        console.log("user data is: ", userData);
        const response = await this.requestPost(this.config.registerEndpoint, {
            method: 'POST',
            body: JSON.stringify(userData)
        })
        console.log("response is: ", response);
        // localStorage.setItem('ocr-api-key', response.api_key);
        return response;
    }

    // File processing
    async processFiles(formData) {
        const response = await this.requestPost(this.config.processEndpoint, {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData
        })
        console.log("response from process files is: ", response);
        return response;
    }

    // Templates
    async getTemplates() {
        return this.requestPost(this.config.templatesEndpoint)
    }

    async createTemplate(template) {
        return this.requestPost(this.config.templatesEndpoint, {
            method: 'POST',
            body: JSON.stringify(template)
        })
    }

    async updateTemplate(id, template) {
        return this.requestPost(`${this.config.templatesEndpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(template)
        })
    }

    async deleteTemplate(id) {
        return this.requestPost(`${this.config.templatesEndpoint}/${id}`, {
            method: 'DELETE'
        })
    }

    // Dashboard data
    async getStats() {
        return this.requestPost('/stats')
    }

    async getRecentFiles() {
        return this.requestPost('/files/recent')
    }

    // Test connection
    async testConnection() {
        return this.requestPost('/health')
    }
}

export const apiService = new ApiService()