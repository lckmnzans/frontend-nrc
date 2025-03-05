<template>
    <div class="forms">
        <form>
            <div class="form-group mb-3" v-for="(field, index) in formData" :key="index">
                <label :for="field.name">{{ field.label }}</label>
                <input class="form-control" :class="attributeValidity(field.name) ? 'border border-danger' : ''" :id="field.name" :type="field.type" v-model="field.value" @input="formChanges(field.name, field.value)" :required="field?.required" :disabled="disabled[index]"/>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    emits: ['formChange'],
    props: {
        formId: {
            type: String,
            required: true
        },
        formData: {
            type: Array,
            required: true
        },
        disabled: {
            type: Array,
            required: false
        },
        attributeStatus: {
            type: Object,
            required: false
        }
    },
    methods: {
        formChanges(key, value) {
            this.$emit('formChange', key, value);
        },
        attributeValidity(attributeName) {
            if (this.attributeStatus) {
                return this.attributeStatus[attributeName];
            }
            return false;
        }
    }
}
</script>