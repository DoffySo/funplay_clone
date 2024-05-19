import { defineStore } from "pinia";
import Cookies from 'js-cookie';
// import jwt from 'jsonwebtoken'


export const useUserStore = defineStore('user', {
    state: () => ({
        user: [],
    }),
    actions: {
        async getUser() {
            console.log(Cookies.get("token"));
        }
    },
    getters: {
    }
})