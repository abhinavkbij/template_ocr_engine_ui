import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userEmail: null,
    }),
    actions: {
        setUserEmail(email) {
            this.userEmail = email
        },
        clearUserEmail() {
            this.userEmail = null
        }
    }
})