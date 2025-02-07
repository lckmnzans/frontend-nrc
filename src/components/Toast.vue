<template>
    <div class="toast" v-if="show">
        <div class="toast-header">
            <span class="text">{{ title == '' ? 'Notifikasi' : title }}</span>
            <button @click.prevent="close" class="button">
                <span class="material-icons">close</span>
            </button>
        </div>
        <div class="toast-body">
            <h6>{{ message }}</h6>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: false,
            default: 'Notifikasi'
        },
        message: {
            required: true
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:show'],
    methods: {
        close() {
            this.$emit('update:show', false);
        }
    }
}
</script>
<style scoped>
.toast {
    display: flex;
    flex-direction: column;
    max-width: 300px;

    .toast-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;

        .button {
            border: none;
            background: none;
            display: flex;
            align-items: center;

            .material-icons {
                font-size: 1.2rem;
                color: #666;
            }
        }

        .button:hover .material-icons {
            color: #333;
        }

        .text {
            font-size: 0.875rem;
            text-align: center;
        }
    }
}
</style>