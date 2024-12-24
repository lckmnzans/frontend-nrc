<template>
    <div class="test-container">
        <div>
            <button class="btn btn-primary btn-mb" @click.prevent="testButton">Click me</button>
            <a>{{ counter }}</a>
        </div>
        <div style="margin-top: 1rem;">
            <button class="btn btn-primary btn-mb" @click.prevent="showToast">Show Toast</button>
        </div>
        <div style="margin-top: 1rem;">
            <button class="btn btn-primary btn-mb" @click.prevent="showAlert">Show Alert</button>
        </div>
        <div class="alert-container" v-if="alert">
            <Alert v-if="alert" :message="alertMessage" :actions="alertActions"/>
        </div>
    </div>
    <div class="toast-container">
        <Toast :show="toast" :message="'Tampilkan Toast'" @update:show="toast = $event"/>
    </div>
</template>
<script>
import Alert from '@/components/Alert.vue';
import Toast from '@/components/Toast.vue';
export default {
    components: { Alert, Toast },
    data() {
        return {
            counter: 0,
            toast: false,
            toastMessage: '',
            alert: false,
            alertMessage: '',
            alertActions: [
                {   label: '',
                    onClick: () => {}
                }
            ]
        }
    },
    methods: {
        testButton() {
            this.counter++;
        },
        showToast() {
            this.toast = true;
            this.toastMessage = 'Anda meng-klik tampilkan toast.';
            setTimeout(() => {
                this.toast = false;
            }, 5000);
        },
        showAlert() {
            this.alertMessage = 'Apakah anda ingin melanjutkan';
            this.alertActions = [
                {   label: 'Lanjutkan',
                    onClick: () => { console.log('Anda melanjutkan'); this.alert = false; }
                },
                {   label: 'Batalkan',
                    onClick: () => { console.log('Anda membatalkan'); this.alert = false; }
                }
            ]
            this.alert = true;
        },
    }
}
</script>
<style lang="scss" scoped>
.test-container {
    position: relative;
    margin: 4px 8px;
    padding: 12px;
    display:flex;
    flex-direction: column;
    align-items: flex-start;

    a {
        margin-left: 2rem;
    }
}

.toast-container {
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    position: fixed;
    z-index: 999;
}

.alert-container {
    display: flex;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 999;
}
</style>