<template>
    <div v-if="visible" class="loading-overlay">
        <div class="spinner"></div>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    }
}
</script>
<style scoped>
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>