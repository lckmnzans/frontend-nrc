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
        <div style="margin-top: 1rem;">
            <button class="btn btn-primary btn-mb" @click.prevent="showPages">Show Pages</button>
        </div>
        <div style="margin-top: 1rem;">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Launch static backdrop modal
            </button>

            <!-- Modal -->
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Understood</button>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="form-container">
            <Forms 
            :form-id="'A01'" 
            :form-data="[
                { name: 'name', label: 'Name', type: 'text', value: '' },
                { name: 'age', label: 'Age', type: 'number', value: '' }
                ]"
                
                @form-change="handleFormChanges"/>
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
import Forms from '@/components/Forms.vue';
import { usePageStore } from '@/store';
import { mapState } from 'pinia';
export default {
    components: { Alert, Toast, Forms },
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
            ],
            docData: {}
        }
    },
    computed: {
        ...mapState(usePageStore, { pages: 'pages'})
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
        handleFormChanges(key, value) {
            this.docData[key] = value;
        }
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