import { defineStore } from "pinia";

export const useToastStore = defineStore('toast-notification', {
    state: () => {
        return {
            toast: false,
            toastTitle: '',
            toastMessage: ''
        }
    },
    actions: {
        setToast(title, message, delay) {
            this.toastTitle = title;
            this.toastMessage = message;
            this.toast = true;
            if (delay) {
                setTimeout(() => {
                    this.toast = false;
                }, delay)
            }
        },
        setToastState(state) {
            this.toast = state;
        }
    }
})