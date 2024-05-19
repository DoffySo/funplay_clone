<script>
import Cookies from 'js-cookie';
// import jwt from 'jsonwebtoken'

export default {
    data() {
        return {
            showSupport: false,
            showBurger: false,
            searchInput: "",
            logged: false,
            burger: document.querySelector("#burger")
        }
    }
}

</script>


<template>
    <header class="header">
        <div class="container">
            <BNavbar style="border-bottom: 1px solid #e4e4e4;" class="text-secondary">
                <div class="container-fluid d-flex align-items-center">
                    <div class="navbar-header d-flex align-items-center" style="width: 260px;">
                        <BNavbarBrand class="h-100 d-flex">
                            <NuxtLink>
                                <img src="/public/logo-funpay.svg" alt="FunPay" style="width: 59px!important; height: 22px!important;">
                            </NuxtLink>
                        </BNavbarBrand>
                        <BNavForm class="d-flex align-items-center h-100">
                            <BFormInput class="border-0 d-flex align-items-center h-100 outline-none mt-1" style="font-size: 16px; outline: none; box-shadow: none;" v-model="searchInput" placeholder="Search by 0 games" />
                            <button class="border-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="#919191" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6" />
                                </svg>
                            </button>
                        </BNavForm>
                    </div>
                    <BNav>
                        <BNavText>
                            <div class="dropdown ms-4">
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
                        <BNavText>
                            <NuxtLink>
                                Purchases
                            </NuxtLink>
                        </BNavText>
                        <BNavText>
                            <NuxtLink>
                                Sales
                            </NuxtLink>
                        </BNavText>
                        <BNavText>
                            <NuxtLink>
                                Messages
                            </NuxtLink>
                        </BNavText>
                        <BNavText>
                            <NuxtLink>
                                Funds
                            </NuxtLink>
                            <BBadge class="fw-normal">0$</BBadge>
                        </BNavText>
                        <BNavText>
                            <div class="dropdown">
                                <a class="dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="/public/avatars/defaultAvatar.png" alt="defaultavatar" height="34px" width="34px" class="rounded-circle">
                                </a>
                                <ul class="dropdown-menu mt-4">
                                    <li class="d-flex w-100">
                                        <NuxtLink class="h-100 w-100 d-flex px-3 pb-2 flex-column">
                                            <div class="fw-bold text-dark">DoffySo</div>
                                            <div style="font-size: 12px" >Profile</div>
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
                        </BNavText>
                    </BNav>
                    <BNav v-if="logged == false" class="gap-3 cursor-pointer ms-auto d-flex align-items-center">
                        <BNavText class="wide">
                            <NuxtLink to="/account/login">
                                Log In
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="wide">
                            <NuxtLink to="/account/register">
                                Sign Up
                            </NuxtLink>
                        </BNavText>
                        <BNavText class="short">
                            <NuxtLink>
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
                        </BNavText>
                    </BNav>
                </div>
            </BNavbar>  
        </div>
    </header>
</template>

<style lang="scss" scoped>
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

    @media screen and (min-width: 900px) {
        .wide {
            display: flex!important;
        }
        .short {
            display: none!important;
        }
    }
    @media screen and (max-width: 900px) {
        .wide {
            display: none!important;
        }
        .short {
            display: flex!important;
        }
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