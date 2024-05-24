<script setup>
        const payment_methods = [
            {value: null, text: 'Not selected'},
            {value: 'balance', text: 'Balance'},
        ]
</script>

<script>
    export default {
        data() {
            return {
                chip: null,
                lot: null,
                offer: null,
                localUser: null,

                payment: null,
                
                userchat: null,
                user: null,
            }
        },
        async mounted() {
            // this.lot = await $fetch("/api/lots/chips/id/list/"+this.$route.params.id)
            this.offer = await $fetch("/api/lots/offers/id/"+this.$route.params.id)
            this.lot = await $fetch("/api/lots/chips/id/list/"+this.offer[0].chipid)
            this.chip = await $fetch("/api/lots/chips/id/"+this.offer[0].chipid)
            await useUserStore().getUser()
            this.localUser = useUserStore().user
            if(this.localUser.length < 1) this.localUser = null
            this.offer = this.offer[0]
            this.userchat = await $fetch(`/api/chats/find?uid=${this.localUser.uid}&ruid=${this.offer.owner}`)
            this.userchat = this.userchat

            console.log(this.offer.owner, "NEGR");

            this.user = await $fetch("/api/users/id/"+this.offer.owner)
            this.user = this.user[0]
            // console.log(this.offer);
            // console.log(this.chip);
            // console.log(this.lot);
            // console.log(this.localUser);
            // this.owner = useUserStore().user.uid
        },
        methods: {
            async buy() {
                if (this.payment == "balance") {
                    const result = await $fetch("/api/lots/offers/buy", {
                        method: "post",
                        body: {
                            buyerid: this.localUser.uid,
                            offerid: this.offer.offerid
                        }
                    })
                    console.log(result);
                } else {
                    console.log(false);
                }
            },
            async confirm() {
                const result = await $fetch("/api/lots/offers/confirm", {
                    method: "post",
                    body: {
                        buyerid: this.localUser.uid,
                        offerid: this.offer.offerid
                    }
                })
                console.log(result);
            }
        }
    }
</script>

<template>
    <div class="corner-cd-container" v-if="this.lot && this.lot.image">
        <div class="corner-cd">
            <img :src="'/images/lots/'+this.lot.image" v-if="this.lot" alt="">
        </div>
    </div>
    <div class="content mt-4">
        <div class="container">
            <div class="product-page">
                <div class="row" v-if="this.lot && this.chip && this.offer">
                    <div class="col-lg-2 col-md-3 col-sm-3">
                        <div class="back-link" v-if=" lot && lot.image != null">
                            <NuxtLink :to="'/lots/'+offer.chipid+'/trade'" class="d-flex align-items-center gap-2 link-light">
                                <svg class="link-light" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                                </svg>
                                <span class="link-light" style="font-size: 14px;">
                                    {{ lot.lotname }} {{ chip.name }}
                                </span>
                            </NuxtLink>
                        </div>
                        <div class="back-link" v-else>
                            <NuxtLink :to="'/lots/'+this.$route.params.id+'/trade'" class="d-flex align-items-center gap-2 link-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                                </svg>
                                <span style="font-size: 14px;">
                                    {{ lot.lotname }} {{ chip.name }}
                                </span>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-9 col-sm-9 container-fluid text-break">
                        <div class="page-content container-fluid">
                            <div class="page-header mb-4 mt-2 container-fluid">
                                <h1 class="fs-2 fw-semibold">Ordering</h1>
                                <span class="d-flex align-items-center gap-1" v-if="offer.automatic">
                                    <svg class="d-flex fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                    </svg>
                                    Automatic delivery</span>
                            </div>
                            <div class="param-list mb-4 mt-2 container-fluid">
                                <div class="d-flex justify-content-between container-fluid">
                                    <div class="col-xs-5">
                                        <div class="param-item">
                                            <h5 class="fw-normal text-secondary text-uppercase" style="font-family: sans-serif!important; font-size: 12px;">Platform</h5>
                                            <p class="fs-6">{{ this.offer.server || "-" }}</p>
                                        </div>
                                    </div>
                                    <div class="col-xs-5">
                                        <div class="param-item">
                                            <h5 class="fw-normal text-secondary text-uppercase" style="font-family: sans-serif!important; font-size: 12px;">In Stock</h5>
                                            <p class="fs-6">{{ offer.amount || "-" }} pcs.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="param-item mb-4 mt-2 container-fluid">
                                    <h5 class="fw-normal text-secondary text-uppercase" style="font-family: sans-serif!important; font-size: 12px;">Short Description</h5>
                                    <div>
                                        {{ offer.shortDescription }}
                                    </div>
                                </div>
                                <div class="param-item mb-4 mt-2 text-wrap d-flex flex-column container-fluid" v-if="this.offer.longDescription">
                                    <h5 class="fw-normal text-secondary text-uppercase" style="font-family: sans-serif!important; font-size: 12px;">Detailed Description</h5>
                                    <div class="text-wrap d-flex">
                                        {{ offer.longDescription }}
                                    </div>
                                </div>
                                <template v-if="offer.confirmed != true">
                                    <BForm v-if="offer.bought == false" class="mb-4 mt-2 container-fluid" @submit="buy">
                                        <BFormGroup class="mb-3 mt-2">
                                            <BFormSelect v-model="this.payment">
                                                <template #first>
                                                    <BFormSelectOption :value="null" class="" disabled style="display: none">
                                                        <span>Not Selected</span>
                                                    </BFormSelectOption>
                                                </template>

                                                <!-- These options will appear after the ones from 'options' prop -->
                                                <BFormSelectOption value="balance" class="d-flex position-relative">
                                                    <div class="d-flex">
                                                        <span class="flex-fill me-4">Balance</span>
                                                        <span>({{ this.offer.price }}$)</span>
                                                    </div>
                                                </BFormSelectOption>
                                            </BFormSelect>
                                        </BFormGroup>
                                        <BFormGroup class="mb-2 mt-2" description="The seller will not be able to receive the payment until you confirm that he has fulfilled his obligations.">
                                            <BButton type="submit" variant="primary" class="container-fluid">Submit</BButton>
                                        </BFormGroup>
                                    </BForm>
                                    <BForm v-if="offer.bought == true && localUser.uid == offer.buyerid" class="mb-4 mt-2 container-fluid" @submit="confirm">
                                        <BFormGroup class="mb-2 mt-2" description="The seller will not be able to receive the payment until you confirm that he has fulfilled his obligations.">
                                            <BButton type="submit" variant="primary" class="container-fluid">Confirm payment</BButton>
                                        </BFormGroup>
                                    </BForm>
                                </template>
                                <template v-else>
                                        <div class="container-fluid fs-3 text-info-emphasis" v-if="offer.buyerid == localUser.uid">
                                            You bought this offer.
                                        </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-10 col-sm-10">
                        <Chat v-if="this.userchat && this.localUser && this.user" :user="this.user" :chat="userchat" :key="this.user._id"></Chat>
                    </div>
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
    margin-right: 400px;
    bottom: 100%;
    margin-bottom: -293px;
    border-radius: 500px;
    overflow: hidden;
}

@media (max-width: 1280px) {
    .corner-cd {
        margin-right: 120px;
    }
}

@media (max-width: 968px) {
    .corner-cd {
        margin-right: 180px;
    }
}
</style>