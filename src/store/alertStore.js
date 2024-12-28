import { defineStore } from "pinia";

export const useAlertStore = defineStore('alert-popup', {
    state: () => {
        return {
            alert: false,
            alertMessage: '',
            /** @type {'success','info','warning','error'} */
            alertType: 'info',
            /** @type {[{label: string, onClick: function}[]]} */
            actions: []
        }
    },
    actions: {
        setAlert(type, message, actions) {
            this.alertType = type;
            this.alertMessage = message;
            this.actions = actions;
            this.alert = true
        },
        setAlertState(state) {
            this.toast = state;
        }
    }
})