import { defineStore } from "pinia";

export const useUserStore = defineStore('user-store', {
    state: () => {
        return {
            user:{
                username: '',
                email: ''
            },
            role: 'admin',
            token: '',
            tokenAge: 0,
        }
    },
    actions: {
        saveProfile(user) {
            this.user = user;
        },
        clear() {
            this.$reset();
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user-store',
                storage: localStorage,
            }
        ]
    }
})