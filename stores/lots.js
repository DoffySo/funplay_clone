import { defineStore } from "pinia";
import Cookies from 'js-cookie';
// import jwt from 'jsonwebtoken'


export const useCategoriesStore = defineStore('category', {
    state: () => ({
        categories: [],
    }),
    actions: {
        async getCategories() {
            const cats = await $fetch("/api/lots")

            this.categories = cats;
        }
    },
    getters: {
    }
})