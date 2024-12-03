const tokenKey = 'token';
const roleKey = 'role';

export default {
    getToken() {
        return localStorage.getItem(tokenKey);
    },
    getRole() {
        return localStorage.getItem(roleKey);
    },
    setToken(token) {
        localStorage.setItem(tokenKey, token);
    },
    setRole(role) {
        localStorage.setItem(roleKey, role);
    }
}