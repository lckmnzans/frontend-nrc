import Vuex from 'vuex';
const vuex = new Vuex.Store({
    state: {
        user: null,
        token: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        }
    },
    actions: {},
    getters: {}
});

export default vuex;