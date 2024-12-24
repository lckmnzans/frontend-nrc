<template>
    <div class="alert alert-light" :class="`alert-${type}`">
        <div class="alert-icon" v-if="icon">
            <span class="material-icons">{{ icon }}</span>
        </div>
        <div class="alert-message">
            {{ message }}
        </div>
        <div class="alert-actions" v-if="actions && actions.length">
            <button v-for="(action, index) in actions" :key="index" class="alert-button" @click.prevent="action.onClick">
                {{ action.label }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: 'info',
            validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
        },
        actions: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style scoped>
.alert {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  border-radius: 5px;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert-icon {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

.alert-message {
  flex-grow: 1;
  margin-bottom: 1rem;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.alert-button {
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.alert-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* .alert-info {
  background-color: #e0f7fa;
  color: #00796b;
}

.alert-success {
  background-color: #e8f5e9;
  color: #388e3c;
}

.alert-warning {
  background-color: #fff8e1;
  color: #f57f17;
}

.alert-error {
  background-color: #ffebee;
  color: #d32f2f;
} */
</style>