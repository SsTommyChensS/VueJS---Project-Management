import { createStore } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
    state() {
        return {
            user: {},
            token: '',
        }
    },
    //This plugin will keep data state even when refresh page 
    plugins: [createPersistedState()],
    getters: {
        isLoggedIn: state => { 
            return state.token;
        },
        getUser: state => {
            return  state.user;
        }
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USER: (state, user) => {
            state.user = user; 
        },
        RESET: state => {
            state.token = '';
            state.user = {};
        },
    },
    actions: {
        login: ({ commit }, { token, user }) => {
            commit('SET_TOKEN', token);
            commit('SET_USER', user);

            // // //Set auth header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout: ({ commit }) => {
            commit('RESET','');
        },
        increment: ({commit}, {newNumaber}) => {
            commit('INCREMENT', newNumaber);
        }
    }
})

export default store;