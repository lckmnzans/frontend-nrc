<template>
    <h4>Profile Anda</h4>
    <p>Ini adalah halaman profil anda</p>
    <form>
        <div class="form-group mb-3">
            <label for="">Username</label>
            <input type="text" :disabled="true" v-model="username" class="form-control">
        </div>
        <div class="form-group mb-3">
            <label for="">Email</label>
            <input type="text" :disabled="true" v-model="email" class="form-control">
        </div>
    </form>
    <router-link to="/change-password" class="btn btn-primary">Ganti Password</router-link>
</template>
<script>
export default {
    data() {
        return {
            username: 'admin',
            email: 'testing@mail.com'
        }
    }
}
</script>