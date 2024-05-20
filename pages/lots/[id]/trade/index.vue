<script>
    export default {
        data() {
            return {
                chip: null,
                lot: null,
                offers: null,
            }
        },
        async mounted() {
            this.chip = await $fetch("/api/lots/chips/id/"+this.$route.params.id)
            this.lot = await $fetch("/api/lots/chips/id/list/"+this.$route.params.id)
            this.offers = await $fetch("/api/lots/offers/chipid/"+this.$route.params.id)

            console.log(this.lot);
        }
    }
</script>

<template>
    <div class="corner-cd-container" v-if="this.lot && this.lot.image">
        <div class="corner-cd">
            <img :src="'/images/lots/'+this.lot.image" v-if="this.lot" alt="">
        </div>
    </div>
    <div class="content" v-if="this.lot && this.chip && this.offers">
        <div class="container">
            <div class="row">
                <div class="col-md-2 col-sm-3 mt-4">
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
                <div class="col-md-10 col-sm-9 mt-4">
                    <div class="page-content">
                        <h1 class="mb-3">Your offers</h1>
                        <div class="text-lg mb-3">Once you add any offers, they will be displayed here.</div>
                        <NuxtLink :to="'/lots/offer/new/'+this.$route.params.id" class="btn btn-primary">Add an offer</NuxtLink>
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
    margin-right: 352px;
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