const tokenKey = 'token'

export default {
    getToken() {
        return localStorage.getItem(tokenKey);
    },
    setToken(token) {
        localStorage.setItem(tokenKey, token);
    }
}