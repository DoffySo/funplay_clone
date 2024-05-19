<script>
import Cookies from 'js-cookie';
import { useUserStore } from '~/stores/user';

export default {
    data() {
        return {
            login: "",
            email: "",
            password: "",
            checkbox: false,
        }
    },
    methods: {
        async handleRegister() {
            console.log(this.login, this.email, this.password, this.checkbox);

            if (this.checkbox) {
                console.log("Registering...");

                const result = await $fetch('/api/account/auth/signup/', {
                    method: 'post',
                    body: {
                        username: this.login,
                        email: this.email,
                        password: this.password
                    }
                })
            }
        }
    },
    async mounted() {
        if (useUserStore().logged)
            await navigateTo("/")
    },
}
</script>


<template>
    <div class="content">
        <div class="page-content modal-auth modal-sm center-block container mt-5">
            <BForm class="col-md-4 d-flex flex-column mx-auto" @submit.prevent="handleRegister">
                <BNav class="w-100 d-flex justify-content-between border-bottom">
                    <BNavText class="" >
                        <NuxtLink class="fw-semibold fs-4 link-primary" to="/account/login">
                            Log In
                        </NuxtLink>
                    </BNavText>
                    <BNavText class="border-bottom border-dark">
                        <div class="fw-semibold fs-4 active">
                            Sign Up
                        </div>
                    </BNavText>
                </BNav>

                <BFormGroup
                id="input-group-1"
                label="Using a username, an email and a password:"
                label-for="input-1"
                class="mt-4 mb-3 text-light-emphasis" style="font-size: 14px;"
                description="Latin letters and numbers">

                <BFormInput
                    id="input-1"
                    v-model="login"
                    type="text"
                    placeholder="Name or username"
                    required
                    class="mb-3 text-dark fw-semibold"
                />

                </BFormGroup>
                
                <BFormGroup
                id="input-group-1"
                label-for="input-1"
                class="mb-3 text-light-emphasis" style="font-size: 14px;"
                description="Required for account activation">

                <BFormInput
                    v-model="email"
                    type="email"
                    placeholder="Email address"
                    required
                    class="mb-3 text-dark fw-semibold"
                />

                </BFormGroup>
                
                <BFormGroup
                class="mb-3 text-light-emphasis" style="font-size: 14px;"
                description="At least 6 characters">

                <BFormInput
                    v-model="password"
                    type="text"
                    placeholder="Password"
                    required
                    class="mb-3 text-dark fw-semibold"
                />

                </BFormGroup>

                <BFormGroup class="checkbox user-select-auto">
                    <BFormCheckbox
                        id="checkbox-1"
                        v-model="checkbox"
                        name="checkbox-1"
                        value="true"
                        unchecked-value="false" class="chk">
                        <div class="mt-1 mb-3" style="font-size: 15px;">
                            I have read and agree to the <NuxtLink to="" class="link-primary">License agreement</NuxtLink>, including <NuxtLink to="" class="link-primary">Agency agreement</NuxtLink>, <NuxtLink to="" class="link-primary">FunPay rules</NuxtLink>
                        </div>
                    </BFormCheckbox>
                </BFormGroup>

                <BButton type="submit" variant="primary" class="w-100 mt-2">Sign Up</BButton>
            </BForm>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .active {
        &:hover {
            cursor: default;
        }
    }

    input {
        box-shadow: none!important;
        outline: none;
        font-size: 15px;
        font-weight: 600;

        &::placeholder {
            color: #919191;
            opacity: 1; /* Firefox */
            font-weight: 400;
            font-size: 15px;
        }

        &::-ms-input-placeholder { /* Edge 12 -18 */
            color: #919191;
            font-weight: 400;
            font-size: 15px;
        }
    }
    .checkbox {
        div, input {
            &:hover {
                cursor: pointer!important;
            }
        }
        &:hover {
            cursor: pointer!important;
        }

        a {
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>