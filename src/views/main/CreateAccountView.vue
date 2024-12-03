<template>
    <div class="header">
        <h4>Buat Akun</h4>
    </div>
    <div class="content">
        <form action="">
            <div class="mb-3">
                <label for="" class="form-label">Username</label>
                <input type="text" class="form-control">
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Email</label>
                <input type="text" class="form-control">
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Password</label>
                <input type="password" class="form-control">
            </div>
        </form>
    </div>
</template>
<script>
import api from '../../api/account.api';
export default {
    inject: ['$auth','$axios'],
    created() {
        const role = this.$auth.getRole();
        if (role !== 'superadmin') {
            router.replace({ path: '/' });
        }
    }
}
</script>
<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}
</style>