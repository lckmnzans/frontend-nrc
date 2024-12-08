const tokenKey = 'token';
const tokenAgeKey = 'tokenAge';
const roleKey = 'role';
const userKey = 'user';

export default {
    getToken() {
        return localStorage.getItem(tokenKey);
    },
    getTokenAge() {
        return localStorage.getItem(tokenAgeKey);
    },
    getRole() {
        return localStorage.getItem(roleKey);
    },
    getUser() {
        return localStorage.getItem(userKey);
    },
    setToken(token) {
        localStorage.setItem(tokenKey, token);
    },
    setTokenAge(tokenAge) {
        localStorage.setItem(tokenAgeKey, tokenAge);
    },
    setRole(role) {
        localStorage.setItem(roleKey, role);
    },
    setUser(id) {
        const user = {
            id: id
        }
        localStorage.setItem(userKey, JSON.stringify(user));
    },
    logout() {
        localStorage.removeItem('role');
        localStorage.removeItem('user')
        localStorage.removeItem('token');
        localStorage.removeItem('tokenAge');
    }
}