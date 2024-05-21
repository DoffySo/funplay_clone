<script>
    export default {
        data() {
            return {
                chip: null,
                lot: null,
                offers: null,
                localUser: null,
            }
        },
        async mounted() {
            this.chip = await $fetch("/api/lots/chips/id/"+this.$route.params.id)
            this.lot = await $fetch("/api/lots/chips/id/list/"+this.$route.params.id)
            this.offers = await $fetch("/api/lots/offers/chipid/"+this.$route.params.id)

            this.localUser = useUserStore().user;

            // console.log(this.lot);
        },
        methods: {
            async editoffer(id) {
                await navigateTo("/lots/offer/edit/"+id, {
                    external: true
                })
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
    <div class="content" v-if="this.lot && this.chip && this.offers && localUser">
        <!-- {{ offers.filter(x => x.owner == localUser.uid) }} -->
        <div class="container">
            <div class="row">
                <div class="col-lg-2 col-md-3 mt-4">
                    <div class="back-link" v-if=" this.lot && this.lot.image != null">
                        <NuxtLink :to="'/lots/'+this.$route.params.id" class="d-flex align-items-center gap-2 link-light">
                            <svg class="link-light" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                            </svg>
                            <span class="link-light" style="font-size: 14px;">
                                {{ lot.lotname }} {{ chip.name }}
                            </span>
                        </NuxtLink>
                    </div>
                    <div class="back-link" v-else>
                        <NuxtLink :to="'/lots/'+this.$route.params.id" class="d-flex align-items-center gap-2 link-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 6l-6 6l6 6" />
                            </svg>
                            <span style="font-size: 14px;">
                                {{ lot.lotname }} {{ chip.name }}
                            </span>
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-lg-10 col-md-9 mt-4" v-if="offers.filter(x => x.owner == localUser.uid).length > 0">
                    <div class="page-content">
                        <div class="row mb-3">
                            <div class="col-lg-6 col-md-5 d-md-flex align-items-center">
                                    <h1 class="d-flex ms-0 fs-2 my-auto fw-bold">Your offers</h1>
                            </div>
                            <div class="col-lg-6 col-md-5 d-flex align-items-center justify-content-end">
                                <NuxtLink :to="'/lots/offer/new/'+this.$route.params.id" class="btn btn-primary d-flex justify-content-center">Add an offer</NuxtLink>
                            </div>
                        </div>
                        <BTableSimple hover small caption-top responsive class="rounded">
                            <BThead head-variant="dark">
                                <BTr>
                                    <BTh class="d-none d-sm-table-cell" style="width: 10%; font-family: sans-serif!important; font-weight: 300!important;">Server</BTh>
                                    <BTh>Description</BTh>
                                    <BTh class="d-none d-sm-table-cell text-end text-nowrap" style="width: 10%; font-family: sans-serif!important; font-weight: 300!important;">In Stock</BTh>
                                    <BTh class="text-end" style="width: 10%; font-family: sans-serif!important; font-weight: 300!important;">Price</BTh>
                                </BTr>
                            </BThead>
                            <BTbody>
                                <BTr @click="editoffer(offer.offerid)" variant="warning" v-for="offer in offers.filter(x => x.owner == localUser.uid).slice().reverse()" :key="offer.offerid">
                                    <BTd class="d-none d-sm-table-cell" style="font-family: sans-serif!important; font-weight: 300!important;" v-if="offer.server">
                                        {{ offer.server }}
                                    </BTd>
                                    <BTd style="font-family: sans-serif!important; font-weight: 300!important;" class="d-none d-sm-table-cell" v-else>
                                        —
                                    </BTd>

                                    <BTd class="d-table-cell">
                                        <div style="font-family: sans-serif!important; font-weight: 600!important; font-size: 13px!important;" class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server || "—" }}</div>
                                        <div style="font-family: sans-serif!important; font-weight: 300!important;" class="fs-6 fs-md-2 text-wrap">{{ offer.shortDescription }}</div>
                                    </BTd>

                                    <BTd style="font-family: sans-serif!important; font-weight: 300!important;" class="d-none d-sm-table-cell text-end">
                                        {{ offer.amount || "—" }}
                                    </BTd>

                                    <BTd style="font-family: sans-serif!important; font-weight: 600!important;" class="text-end text-nowrap">
                                        {{ offer.price }} $
                                    </BTd>
                                </BTr>
                            </BTbody>
                        </BTableSimple>
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
    margin-right: 500px;
    bottom: 100%;
    margin-bottom: -293px;
    border-radius: 500px;
    overflow: hidden;
}

@media (max-width: 1280px) {
    .corner-cd {
        margin-right: 330px;
    }
}

@media (max-width: 968px) {
    .corner-cd {
        margin-right: 180px;
    }
}

tr td {
    height: 60px;
    &:hover {
        cursor: pointer;
    }
}

.row {
        a {
            align-self: flex-end;
            width: 200px;
        }
    }

@media (max-width: 767px) {
    .row {
        a {
            align-self: flex-start;
            width: 100%;
        }
    }

    .corner-cd {
        margin-right: 0;
        right: auto;
        margin-bottom: -132px;
        left: 0;
        margin-left: -275px;
    }
}

</style>