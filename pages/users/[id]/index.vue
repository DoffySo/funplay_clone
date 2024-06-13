<script setup>

const dropZone = ref()
const selectedImage = ref()
const cropperElement = ref()
const imageUrl = ref();
const cropper = ref();
const {files} = useDropZone(dropZone, {onDrop})
const { open: openFileDialog, files: dialogFiles } = useFileDialog({ multiple: false, accept: 'image/*' });

async function onDrop() {
    if (files.value) {
        files.value.forEach(async (file) => {
            if (!selectedImage.value) {
                if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
                    selectedImage.value = file
                    imageUrl.value = await URL.createObjectURL(file)
                    // cropper.value = new VueCropper()
                } else {
                    console.log("Invalid file type")
                }
            }
        })
    }

    return {
        VueCropper
    }
}

watch(dialogFiles, async (newFiles) => {
  if (newFiles.length > 0) {
    const file = newFiles[0];
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      selectedImage.value = file;
      imageUrl.value = await URL.createObjectURL(file);
    } else {
      console.log("Invalid file type");
    }
  }
});

function clearFiles() {
    selectedImage.value = null;
    imageUrl.value = null;
}

</script>

<script>
import VueCropper from 'vue-cropperjs';
import '~/public/cropperjs/cropper.css';

import * as timeago from 'timeago.js';
export default {
    // components: { VueCropper },
    data() {
        return {
            timeagolib: timeago,
            user: null,
            localUser: null,
            userchat: null,

            changeImageModal: true,
        }

    },

    async mounted() {
            this.user = await $fetch("/api/users/id/"+this.$route.params.id)
            await useUserStore().getUser()
            this.localUser = useUserStore().user


            this.user = this.user[0]

            this.userchat = await $fetch(`/api/chats/find?uid=${this.localUser.uid}&ruid=${this.user.uid}`)

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
        },
        async cropImage() {
            const croppedAvatar = this.$refs.cropperElement.getCroppedCanvas().toDataURL()
            const formData = new FormData();


            let imgtype;

            // thx chatgpt for code
            function dataURLtoFile(dataURL) {
                const [dataPrefix, encodedData] = dataURL.split(',');
                const mimeType = dataPrefix.match(/:(.*?);/)[1];
                const binaryString = atob(encodedData);
                const len = binaryString.length;
                const arrayBuffer = new ArrayBuffer(len);
                const uint8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < len; i++) {
                    uint8Array[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([arrayBuffer], { type: mimeType });
                const fileName = 'filename.' + mimeType.split('/')[1];
                imgtype = mimeType.split('/')[1];
                return new File([blob], fileName, { type: mimeType });
            }
            //
            //
            const file = dataURLtoFile(croppedAvatar);
            formData.append('file', file, `${Date.now()}.${imgtype}`)
            console.log(formData.get("file"))
            const res = await $fetch('/api/upload', {
                method: "post",
                body: formData
            })

            await $fetch("/api/updateimage", {
                method: "post",
                body: {
                    _id: this.localUser._id,
                    filename: res.filename
                }
            })

            window.location.reload();
        },
    }
}



</script>

<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content bg-transparent border-0">
                <div class="modal-header text-white border-0 d-flex align-items-center">
                    <button type="button" class="text-white link-light border-0 bg-transparent ms-auto fw-bold" data-bs-dismiss="modal" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                        </svg>
                    </button>
                </div>
                <div class="modal-body border-0 bg-white">
                    <div class="container">
                        <h1 class="display-6">Avatar</h1>
                    </div>
                    <div v-if="!selectedImage && !cropperElement" class="container-fluid dropzone border-2 border-secondary rounded-1 d-flex align-items-center justify-content-center" style="border-style: dashed!important; min-height: 200px;" ref="dropZone">
                        <div class="hint text-body-secondary">
                            <div class="d-flex flex-column align-items-center mt-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24">
                                    <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                        <path d="M7 7a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-1 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0" />
                                        <path d="M3 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm18 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4.314l6.878-6.879a3 3 0 0 1 4.243 0L22 15.686V6a1 1 0 0 0-1-1m0 14H10.142l5.465-5.464a1 1 0 0 1 1.414 0l4.886 4.886A1 1 0 0 1 21 19" />
                                    </g>
                                </svg>
                                <div class="mt-2 fw-normal fs-6">Drag an image here</div>
                            </div>
                        </div>
                    </div>
                    <div class="avatar-preview d-flex align-items-center my-auto mx-auto justify-content-center">
                        <VueCropper
                            v-if="imageUrl"
                            :src="imageUrl"
                            ref="cropperElement"
                            alt="Cropped Image"
                            :aspect-ratio="1"
                            />
                    </div>

                    <div class="mt-3 d-flex gap-2">
                        <button class="btn btn-outline-success" @click="openFileDialog()">Upload</button>
                        <button class="btn btn-outline-dark" v-if="imageUrl" @click="clearFiles()">Clear</button>
                        <button class="btn btn-primary ms-auto" @click="cropImage()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Head v-if="this.user">
      <Title>User {{ this.user.username }} / FunPay</Title>
    </Head>
    <Head v-else>
        <Title>User not found... / FunPay</Title>
    </Head>

    <div class="content">
        <div class="container" v-if="this.user">
            
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
                <div class="avatar rounded-circle">
                    <div class="avatar-photo rounded-circle position-relative" style="background-size: contain;" :style="'background-image: url(/avatars/'+ this.user.avatarName +')'">
                        <div data-bs-toggle="modal" data-bs-target="#exampleModal" v-if="this.user && this.localUser && (this.user._id == this.localUser._id)" class="edit-circle btn btn-primary rounded-circle d-none d-md-flex align-items-center justify-content-center position-absolute translate-middle" style="height: 100%; left: 80%; top: 10%;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 36 36">
                                <path fill="white" d="m4.22 23.2l-1.9 8.2a2.06 2.06 0 0 0 2 2.5a2.14 2.14 0 0 0 .43 0L13 32l15.84-15.78L20 7.4Z" class="clr-i-solid clr-i-solid-path-1" />
                                <path fill="white" d="m33.82 8.32l-5.9-5.9a2.07 2.07 0 0 0-2.92 0L21.72 5.7l8.83 8.83l3.28-3.28a2.07 2.07 0 0 0-.01-2.93" class="clr-i-solid clr-i-solid-path-2" />
                                <path fill="none" d="M0 0h36v36H0z" />
                            </svg>
                        </div>
                    </div>
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
                    <div class="col-md-6"></div>
                    <div class="col-lg-5 col-md-7 container">
                        <Chat v-if="this.userchat && this.userchat.messages && this.userchat.messages.length > 0 && this.localUser && this.user && (this.user.uid != this.localUser.uid)" :user="this.user" :chat="userchat" :key="this.user._id"></Chat>
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

.avatar, .avatar .avatar-photo {
    width: 170px!important;
    height: 170px!important;
}
.edit-circle {
    height: 40px!important;
    width: 40px!important;
}

@media (max-width: 767px) {
    .avatar, .avatar .avatar-photo {
        width: 70px!important;
        height: 70px!important;
    }
}
</style>