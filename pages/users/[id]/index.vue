<script>
import * as timeago from 'timeago.js';

export default {
    data() {
        return {
            timeagolib: timeago,
            user: null,
            localUser: null,
            userchat: null,
        }

    },
    setup() {
    },
    async mounted() {
            this.user = await $fetch("/api/users/id/"+this.$route.params.id)
            await useUserStore().getUser()
            this.localUser = useUserStore().user


            this.user = this.user[0]

            this.userchat = await $fetch(`/api/chats/find?uid=${this.localUser.uid}&ruid=${this.user.uid}`)
            this.userchat = this.userchat[0]
            console.log(this.userchat);


            console.log(this.user);
            console.log(this.localUser);
    },
    methods: {
        formatDate(timestamp) {
            const date = new Date(timestamp);
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${day} ${month} ${year}, ${hours}:${minutes}`;
        }
    }
}

</script>

<template>
    <Head v-if="this.user">
      <Title>User {{ this.user.username }} / FunPay</Title>
    </Head>
    <Head v-else>
        <Title>User not found... / FunPay</Title>
    </Head>

    <div class="content">
        <div class="container" v-if="this.user">

            {{ this.user }}
            
            <div class="profile-cover">
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <div class="profile-cover-container">
                    <div class="profile-cover-img" style="background-image:url('/images/profile-header.jpg')"></div>
                </div>
            </div>
            <div class="profile">
                <div class="avatar rounded-circle position-relative" style="height: 170px; width: 170px;">
                    <div v-if="this.user._id == this.localUser._id" class="edit-circle btn btn-primary rounded-circle d-flex align-items-center justify-content-center position-absolute translate-middle" style="height: 40px; width: 40px; left: 80%; top: 10%;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 36 36">
                            <path fill="white" d="m4.22 23.2l-1.9 8.2a2.06 2.06 0 0 0 2 2.5a2.14 2.14 0 0 0 .43 0L13 32l15.84-15.78L20 7.4Z" class="clr-i-solid clr-i-solid-path-1" />
                            <path fill="white" d="m33.82 8.32l-5.9-5.9a2.07 2.07 0 0 0-2.92 0L21.72 5.7l8.83 8.83l3.28-3.28a2.07 2.07 0 0 0-.01-2.93" class="clr-i-solid clr-i-solid-path-2" />
                            <path fill="none" d="M0 0h36v36H0z" />
                        </svg>
                    </div>
                    <div class="avatar-photo rounded-circle" style="width: 100%; height: 100%; background-size: contain;" :style="'background-image: url(/avatars/'+ this.user.avatarName +')'"></div>
                </div>
                <div class="mt-4 d-flex align-items-center gap-3">
                    <span class="fs-2">
                        {{ this.user.username }}
                    </span>
                    <div class="user-badges d-flex gap-1 fs-5 display-6" style="font-family: sans-serif!important;" v-if="this.user.support || this.user.admin || this.user.banned">
                        <BBadge class="fw-light" v-if="this.user.admin" variant="dark">admin</BBadge>
                        <BBadge class="fw-light" v-if="this.user.support" variant="success">support</BBadge>
                        <BBadge class="fw-light" v-if="this.user.banned" variant="danger">banned</BBadge>
                    </div>
                </div>
                <div class="row mt-4 mb-3">
                    <div class="col-lg-7 col-md-9">
                        <div class="row row-10">
                            <div class="col-sm-4 col-xs-6">
                                <div class="param-item mb15">
                                    <h5 class="text-uppercase text-secondary fw-semibold" style="letter-spacing: 1px; font-size: 10px; font-family: sans-serif!important;">Registration date</h5>
                                    <div class="text-nowrap fw-normal display-6 fs-6" style="font-family: sans-serif!important;">
                                        {{ formatDate(this.user.registerDate) }}
                                        <br>
                                        {{ timeagolib.format(this.user.registerDate) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-light">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="col-md-7"></div>
                    <div class="col-md-4 container-fluid container">
                        <Chat v-if="this.userchat && this.user" :user="this.user" :chat="userchat" :key="this.user._id"></Chat>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-cover-img {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background-clip: border-box;
    background: no-repeat center bottom;
    background-size: 100% auto;
}


@media (max-width: 1280px) {
    .profile-cover-container {
        left: -140px;
        right: -140px;
    }

    .profile-cover {
        padding-left: 15px;
        padding-right: 15px;
        margin-left: -15px;
        margin-right: -15px;
    }
}
@media (max-width: 1199px) {
    .profile-cover-container {
        left: -90px;
        right: -90px;
    }
    .profile-cover {
        padding-left: 30px;
        padding-right: 30px;
        margin-left: -30px;
        margin-right: -30px;
    }
}
@media (max-width: 1050px) {
    .profile-cover-container {
        left: -80px;
        right: -80px;
    }

    .profile-cover {
        padding-left: 15px;
        padding-right: 15px;
        margin-left: -15px;
        margin-right: -15px;
    }
}
.profile-cover-container {
    position: absolute;
    bottom: 0;
    left: -150px;
    right: -150px;
    width: auto;
    overflow: hidden;
    padding-top: 120%;
    border-radius: 50%;
    z-index: -1;
}

.profile-cover {
    position: relative;
    overflow: hidden;
    padding-left: 30px;
    padding-right: 30px;
}

@media (max-width: 767px) {
    .avatar .avatar-photo {
        width: 70px!important;
        height: 70px!important;
    }
}
</style>