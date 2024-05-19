import { defineStore } from "pinia";
import Cookies from 'js-cookie';
// import jwt from 'jsonwebtoken'


export const useUserStore = defineStore('user', {
    state: () => ({
        user: [],
        expired: false,
        logged: false,
    }),
    actions: {
        async getUser() {
            const token_info = await $fetch('/api/account/token/', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });
            if (token_info.code === 200) {
                const user_info = await $fetch('/api/users/id/'+parseInt(token_info.data.uid))
                this.user = user_info[0];
                this.expired = false;
                this.logged = true;
                return;
            } else if(token_info.code === 401) {
                this.user = [];
                this.expired = true;
                this.logged = false;
                Cookies.remove("token")
                return
            } else {
                this.user = [];
                this.logged = false;
                this.expired = false;
                return;
            }
        }
    },
    getters: {
    }
})