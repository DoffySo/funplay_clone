<script>
import {ref, computed} from 'vue'
    export default {
        data() {
            return {
                chip: null,
                lot: null,
                offers: null,
                localUser: null,

                formError: true,

                shortdescerr: "",
                // form
                offerid: 0,
                chipid: this.$route.params.id,
                owner: null,
                platform: null,
                launcher: null,
                region: null,
                price: null,
                amount: 1,
                shortdesc: "",
                longdesc: null,
                automatic: false,
                autoactive: true,
            }
        },
        async mounted() {
            this.chip = await $fetch("/api/lots/chips/id/"+this.$route.params.id)
            this.lot = await $fetch("/api/lots/chips/id/list/"+this.$route.params.id)
            this.offers = await $fetch("/api/lots/offers/chipid/"+this.$route.params.id)

            this.localUser = useUserStore().user

            this.owner = useUserStore().user.uid
        },
        methods: {
        },
        watch: {
            shortdesc(newText) {
                if (newText.length < 4) {
                    this.shortdescerr = 'Text must contain at least 4 characters.';
                    this.formError = true
                } else if (newText.length > 60) {
                    this.shortdescerr = 'Text must not exceed 60 characters.';
                    this.formError = true
                } else {
                    this.shortdescerr = '';
                    this.formError = false
                }
            },
        }
    }
</script>

<template>
    <div class="corner-cd-container" v-if="this.lot && this.lot.image">
        <div class="corner-cd">
            <img :src="'/images/lots/'+this.lot.image" v-if="this.lot" alt="">
        </div>
    </div>
    <div class="content">
        <div class="container d-lg-flex">
            <div class="col-md-2 col-sm-2 mt-4">
                    <div class="back-link" v-if=" this.lot && this.lot.image != null">
                        <NuxtLink :to="'/lots/'+this.$route.params.id+'/trade'" class="d-flex align-items-center gap-2 link-light">
                            <svg class="link-light" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                            </svg>
                            <span class="link-light" style="font-size: 14px;">
                                Back
                            </span>
                        </NuxtLink>
                    </div>
                    <div class="back-link" v-else>
                        <NuxtLink :to="'/lots/'+this.$route.params.id+'/trade'" class="d-flex align-items-center gap-2 link-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                            </svg>
                            <span style="font-size: 14px;">
                                Back
                            </span>
                        </NuxtLink>
                    </div>
            </div>
            <div class="col-md-10 col-sm-9 mt-4">
                <div class="page-content">
                    <h1 class="page-header">
                        New offer
                    </h1>
                    <BForm v-if="this.chip && this.lot && this.offers">
                        <input type="hidden" name="offerid" value="0">
                        <input type="hidden" name="chipid" v-model="chipid">
                        <input type="hidden" name="owner" v-if="localUser" :value="localUser.uid">

                        <!-- {{ chip }} -->

                        offerid: {{ offerid }}
                        chipid: {{ chipid }}
                        owner: {{ owner }}
                        region: {{ region }}
                        price: {{ price}}
                        platform: {{ platform }}
                        launcer: {{ launcher }}
                        shortdesc: {{ shortdesc }}
                        longdesc: {{ longdesc }}

                        <BFormGroup class="mb-4" v-if="chip.platforms">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                Platform / Server
                            </BFormText>
                            <BFormSelect required v-model="platform" :options="chip.platforms" />
                        </BFormGroup>
                        <BFormGroup class="mb-4" v-if="chip.launcher" label="Launcher">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                Launcher
                            </BFormText>
                            <BFormSelect required v-model="launcher" :options="chip.launcher" />
                        </BFormGroup>
                        <!-- Short Desc -->
                        <BFormGroup class="mb-4">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                Short Description
                            </BFormText>
                            <BFormInput required v-model="shortdesc" />
                            <BFormGroup class="text-danger" v-if="formError">
                                <BFormText class="text-danger" style="font-family: sans-serif!important; font-weight: 500!important; font-size: 14px; color: #DC3545!important;">
                                    {{ shortdescerr }}
                                </BFormText>
                            </BFormGroup>
                            <BFormText class="text-secondary" style="font-family: sans-serif!important; font-weight: 500!important; font-size: 14px; ">
                                Appears directly on the table
                            </BFormText>
                        </BFormGroup>
                        <!-- Long Desc -->
                        <BFormGroup class="mb-4">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                Detailed Description
                            </BFormText>
                            <BFormTextarea rows="7" v-model="longdesc" />
                            <BFormText class="text-secondary text-secondary" style="font-family: sans-serif!important; font-weight: 500!important; font-size: 14px; ">
                                Optional.
                            </BFormText>
                        </BFormGroup>

                        <hr>
                        <!-- Automatic Delivery -->
                        <BFormGroup class="mb-2">
                            <BFormCheckbox v-model="automatic" value="true" unchecked-value="false">
                                <span style="font-weight: 300!important; font-family: sans-serif!important; font-size: 14px;">Automatic delivery</span>
                            </BFormCheckbox>
                        </BFormGroup>
                        <!-- Price -->
                        <BFormGroup class="mb-2">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                Price for 1 pcs. ($)
                            </BFormText>
                            <BFormInput type="number" class="container-md" required v-model="price" />
                        </BFormGroup>
                        <!-- Amount -->
                        <BFormGroup class="mb-2">
                            <BFormText class="text-uppercase" style="font-family: sans-serif!important; font-weight: 300!important; font-size: 10px; letter-spacing: 1px;">
                                In Stock (pcs)
                            </BFormText>
                            <BFormInput type="number" placeholder="1" class="container-md" required v-model="amount" />
                        </BFormGroup>
                        <!-- Active -->
                        <BFormGroup class="mb-2">
                            <BFormCheckbox v-model="autoactive" value="true" unchecked-value="false">
                                <span style="font-weight: 300!important; font-family: sans-serif!important; font-size: 14px;">Active</span>
                            </BFormCheckbox>
                        </BFormGroup>
                        <!--  -->

                        <BFormGroup>
                            <BButton class="w-100" type="submit" variant="primary" :disabled="formError">Save</BButton>
                            <div class="w-100 mt-2 justify-content-center d-flex" v-if="formError">
                                <span class="text-danger">You need to fill all fields to continue.</span>
                            </div>
                        </BFormGroup>
                    </BForm>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>


.corner-cd-container {
    width: 100%;
    height: 450px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    overflow: hidden;
    z-index: -1;
}

.corner-cd {
    width: 715px;
    height: 715px;
    position: absolute;
    z-index: -1;
    right: 45%;
    margin-right: 290px;
    bottom: 100%;
    margin-bottom: -293px;
    border-radius: 500px;
    overflow: hidden;
}

@media (max-width: 767px) {
    .corner-cd {
        margin-right: 0;
        right: auto;
        margin-bottom: -132px;
        left: 0;
        margin-left: -275px;
    }
}

</style>