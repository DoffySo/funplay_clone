<script>
import Cookies from 'js-cookie';
import { useUserStore } from '~/stores/user';

export default {
    data() {
        return {
            login: "",
            password: "",

            alert_type: null,
            show_alert: false,
            alert_title: "",
            alert_message: "",
        }
    },
    methods: {
        async handleLogin() {
            console.log(this.login, this.password);

                console.log("Loggining...");

                const result = await $fetch('/api/account/auth/login/', {
                    method: 'post',
                    body: {
                        username: this.login,
                        password: this.password
                    }
                })

                this.alert_type = result.type
                this.show_alert = true
                this.alert_title = result.alert_header
                this.alert_message = result.message

                if (result.code == 200) {
                    Cookies.set("token", result.token, {
                        expires: 1,
                    })

                    setTimeout( async () => {
                        await navigateTo("/", {external: true})
                    }, 1000)
                }

                // console.log(result);
        }
    },
    async created() {
        if (useUserStore().logged || useUserStore().user.length > 0 || Cookies.get("token"))
            await navigateTo("/")
    }
}
</script>


<template>
    <div class="content">
        <div class="page-content modal-auth modal-sm center-block container mt-5">
            <BForm class="col-md-4 col-sm-7 d-flex flex-column mx-auto" @submit.prevent="handleLogin">
                <BAlert :model-value="show_alert" :variant="alert_type || 'warning'">
                    <h1 class="alert-heading fs-4">
                        {{ alert_title }}
                    </h1>
                    <hr>
                    <span class="fs-6">
                        {{ alert_message }}
                    </span>
                </BAlert>
                <BNav class="w-100 d-flex justify-content-between border-bottom">
                    <BNavText class="border-bottom border-dark" >
                        <div class="fw-semibold fs-4 active">
                            Log In
                        </div>
                    </BNavText>
                    <BNavText class="">
                        <NuxtLink class="fw-semibold fs-4 link-primary" to="/account/register">
                            Sign Up
                        </NuxtLink>
                    </BNavText>
                </BNav>

                <BFormGroup
                id="input-group-1"
                label="Using a username, an email and a password:"
                label-for="input-1"
                class="mt-4 mb-3 text-light-emphasis" style="font-size: 14px;">

                <BFormInput
                    id="input-1"
                    v-model="login"
                    type="text"
                    placeholder="Username or email address"
                    required
                    class="mb-3 text-dark fw-semibold"
                    description="Test"
                />

                <BFormInput
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    required
                    class="mb-3 text-dark fw-semibold"
                />

                </BFormGroup>
                <BButton type="submit" variant="primary" class="w-100 mt-2">Log In</BButton>
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
</style>