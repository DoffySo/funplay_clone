<script>
import Cookies from 'js-cookie';
import { useUserStore } from '~/stores/user';
import { useCategoriesStore } from '~/stores/lots'
// import jwt from 'jsonwebtoken'

export default {
    data() {
        return {
            showSupport: false,
            showBurgerSupport: false,
            showBurger: false,
            showProfile: false,

            searchInput: "",
            burger: document.querySelector("#burger"),
            gamesCount: 0,

            modal: false,
            logged: false,

            localUser: null,
        }
    },
    methods: {
        async logout() {
            if (useUserStore().logged && !useUserStore().expired) {
                Cookies.remove("token")
                useUserStore().logged = false
                useUserStore().expired = false
                useUserStore().user = []
                this.logged = false

                reloadNuxtApp({
                    ttl: 2000,
                    force: true,
                })
            }
        }
    },
    async mounted() {
        await useUserStore().getUser()
        await useCategoriesStore().getCategories();
        this.modal = useUserStore().expired;
        this.logged = useUserStore().logged;
        this.gamesCount = useCategoriesStore().categories.length 
        this.localUser = useUserStore().user
    }
}

</script>


<template>
    <BModal v-if="modal" v-model="modal" centered title="Authentication Error" :okOnly="true" :lazy="true"> You are no longer authorized and need to authenticate again. </BModal>

    <header class="header">
        <div class="container">
            <BNavbar style="border-bottom: 1px solid #e4e4e4;" class="text-secondary">
                <div class="container-fluid d-flex align-items-center">
                    <div class="navbar-header d-flex align-items-center" style="width: 260px;">
                        <BNavbarBrand class="h-100 d-flex">
                            <NuxtLink to="/" :external="true">
                                <img src="/public/logo-funpay.svg" alt="FunPay" style="width: 59px!important; height: 22px!important;">
                            </NuxtLink>
                        </BNavbarBrand>
                        <BNavForm class="d-flex align-items-center h-100">
                            <BFormInput class="border-0 d-flex align-items-center h-100 outline-none mt-1 bg-transparent" style="font-size: 16px; outline: none; box-shadow: none; font-weight: 300!important; font-family: sans-serif;" v-model="searchInput" :placeholder="'Search by ' + gamesCount + ' games'" />
                            <button class="border-0 bg-transparent">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="#919191" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6" />
                                </svg>
                            </button>
                        </BNavForm>
                    </div>
                    <BNav>
                        <BNavText>
                            <div class="dropdown ms-4 d-none d-sm-block">
                                <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Support
                                </a>
                                <ul class="dropdown-menu mt-4">
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 pb-2">
                                            Rules
                                        </NuxtLink>
                                    </li>
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                            Support Center
                                        </NuxtLink>
                                    </li>
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                            Submit a Request
                                        </NuxtLink>
                                    </li>
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 pt-2">
                                            My Requests
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </BNavText>
                        <!-- <BNavItem class="text-secondary">About</BNavItem> -->
                    </BNav>
                    <BNav v-if="logged == true" class="gap-3 cursor-pointer ms-auto d-flex align-items-center">
                        <BNavText class="d-none d-lg-flex">
                            <NuxtLink>
                                Purchases
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="d-none d-lg-flex">
                            <NuxtLink>
                                Sales
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="d-none d-lg-flex">
                            <NuxtLink>
                                Messages
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="d-none d-lg-flex">
                            <NuxtLink>
                                Funds
                            </NuxtLink>
                            <BBadge class="fw-normal">{{ useUserStore().user.balance }}$</BBadge>
                        </BNavText>
                        <BNavText class="ms-auto d-flex">
                            <BDropdown no-caret size="sm" end offset="25" auto-close="outside" v-model="showProfile" variant="link"  toggle-class="text-decoration-none d-flex align-items-center" v-if="localUser">
                                
                                <template #button-content> 
                                    
                                    <div class="profile d-flex align-items-center justify-content-end gap-1" :class="showProfile ? 'link-dark' : 'text-secondary'" style="width: 49px; height: 36px;">
                                        <div class="avatar rounded-circle" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+ localUser.avatarName +')'">
                                        </div>
                                        <svg :class="showProfile ? 'text-dark' : 'text-secondary'" xmlns="http://www.w3.org/2000/svg" width="9px" height="9px" viewBox="0 0 16 16">
                                            <path fill="currentColor" d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                    </div>
                                    <span class="visually-hidden">Menu</span> 
                                </template>

                                <BDropdownItem :href="'/users/'+localUser.uid">
                                    <div class="profile link-secondary">
                                        <div class="user-name fw-bold text-dark">
                                            {{ localUser.username }}
                                        </div>
                                        <span class="" style="font-size: 14px;">
                                            Profile
                                        </span>
                                    </div>
                                </BDropdownItem>

                                <BDropdownItem href="/account/settings" class="link-secondary">
                                    <NuxtLink to="/account/settings">Settings</NuxtLink>
                                </BDropdownItem>

                                <BDropdownItem class="d-flex d-lg-none">
                                    <NuxtLink>
                                        Funds
                                    </NuxtLink>
                                    <BBadge class="fw-normal">{{ useUserStore().user.balance }}$</BBadge>
                                </BDropdownItem>

                                <BDropdownItem @click="logout" class="link-secondary">
                                    <NuxtLink>Log Out</NuxtLink>
                                </BDropdownItem>

                            </BDropdown>
                        </BNavText>
                    </BNav>
                    <BNav v-if="logged == false" class="gap-3 cursor-pointer ms-auto d-flex align-items-center">
                        <BNavText class="wide d-none d-sm-flex">
                            <NuxtLink to="/account/login">
                                Log In
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="wide d-none d-sm-flex">
                            <NuxtLink to="/account/register">
                                Sign Up
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="d-flex d-sm-none">
                            <NuxtLink v-if="false">
                                <div class="dropdown">
                                <a class="dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#919191" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </a>
                                <ul class="dropdown-menu mt-4">
                                        <li class="d-flex w-100">
                                            <NuxtLink class="h-100 w-100 d-flex px-3">
                                                <div class="dropdown ms-4">
                                    <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="true">
                                        Support
                                    </a>
                                    <ul class="dropdown-menu mt-4">
                                        <li class="d-flex w-100">
                                            <NuxtLink class="h-100 w-100 d-flex px-3 pb-2">
                                                Rules
                                            </NuxtLink>
                                        </li>
                                        <li class="d-flex w-100">
                                            <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                                Support Center
                                            </NuxtLink>
                                        </li>
                                        <li class="d-flex w-100">
                                            <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                                Submit a Request
                                            </NuxtLink>
                                        </li>
                                        <li class="d-flex w-100">
                                            <NuxtLink class="h-100 w-100 d-flex px-3 pt-2">
                                                My Requests
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                                        </NuxtLink>
                                    </li>
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                            Settings
                                        </NuxtLink>
                                    </li>
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 py-2">
                                            Log Out
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                            </NuxtLink>
                            <BDropdown auto-close="outside" v-model="burger" size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
                                <template #button-content> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#919191" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <span class="visually-hidden">Menu</span> 
                                </template>


                                <BDropdownItemButton @click="showBurgerSupport = !showBurgerSupport" class="w-100 d-flex flex-column">
                                    <NuxtLink>
                                        <span :class="showBurgerSupport ? 'link-dark' : 'text-secondary'">
                                            Support
                                        </span>
                                        <svg :class="showBurgerSupport ? 'link-dark' : 'text-secondary'" xmlns="http://www.w3.org/2000/svg" width="8px" height="8px" viewBox="0 0 16 16">
                                            <path fill="currentColor" d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                    </NuxtLink>
                                </BDropdownItemButton>

                                <BDropdownItem class="" v-if="showBurgerSupport">
                                    <NuxtLink class="ms-2 h-100 w-100 d-flex">
                                        Rules
                                    </NuxtLink>
                                </BDropdownItem>
                                <BDropdownItem class="" v-if="showBurgerSupport">
                                    <NuxtLink class="ms-2 h-100 w-100 d-flex">
                                        Support Center
                                    </NuxtLink>
                                </BDropdownItem>
                                <BDropdownItem class="" v-if="showBurgerSupport">
                                    <NuxtLink class="ms-2 h-100 w-100 d-flex">
                                        Submit a Request
                                    </NuxtLink>
                                </BDropdownItem>
                                <BDropdownItem class="" v-if="showBurgerSupport">
                                    <NuxtLink class="ms-2 h-100 w-100 d-flex">
                                        My Requests
                                    </NuxtLink>
                                </BDropdownItem>

                                <BDropdownItem href="/account/login">
                                    <NuxtLink to="/account/login">Log In</NuxtLink>
                                </BDropdownItem>
                                <BDropdownItem href="/account/register">
                                    <NuxtLink to="/account/register">Register</NuxtLink>
                                </BDropdownItem>
                            </BDropdown>
                        </BNavText>
                    </BNav>
                </div>
            </BNavbar>  
        </div>
    </header>
</template>

<style lang="scss" scoped>
    header.header {
        * {
            font-weight: 500;
            font-family: sans-serif!important;
        }

        .container {
            transition: all 150ms ease;
        }
    }
    .nav, a {
        color: #919191!important;
    }
    input {
        font-size: 14px!important;
    }
    a {
        transition: 100ms ease all;
        font-size: 14px;
    }
    a:hover {
        color: #000!important;
        transition: all 100ms ease;
    }

    .show {
        color: #000!important;
        stroke: #000!important;
    }


    .burger {
        display: flex;
        flex-direction: column;

        &-line {
            width: 100%;
            height: 2px;
            margin-top: 2px;
            background: #919191;
        }
    }
</style>