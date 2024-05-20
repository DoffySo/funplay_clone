<script>
import * as timeago from 'timeago.js';
export default {
    data() {
        return {
            chip: null,
            lot: null,
            offers: null,
            users: null,
            timeagolib: timeago,

            sortby: "default",
            asc: true,

            filterDropdown: false,

            automaticDelivery: false,
            platform: null,
        }
    },
    async mounted() {
        this.chip = await $fetch("/api/lots/chips/id/"+this.$route.params.id)
        this.lot = await $fetch("/api/lots/chips/id/list/"+this.$route.params.id)
        this.offers = await $fetch("/api/lots/offers/chipid/"+this.$route.params.id)
        this.users = await $fetch("/api/users")
    },
    methods: {
        async gotoffer(id) {
            await navigateTo('/lots/offer/'+id, {
                external: true
            })
        },
        getFilteredSortedOffers() {
            let filteredOffers = this.offers;

            // Фильтрация по платформе
            if (this.selectedPlatform !== 'all') {
                filteredOffers = filteredOffers.filter(offer => offer.platform === this.selectedPlatform);
            }

            // Фильтрация по автоматической доставке
            if (this.automaticDelivery) {
                filteredOffers = filteredOffers.filter(offer => offer.automatic);
            }

            // Сортировка предложений
            if (this.sortby === 'price') {
                filteredOffers = filteredOffers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                if (!this.asc) {
                    filteredOffers = filteredOffers.reverse();
                }
            } else if (this.sortby === 'default') {
                filteredOffers = filteredOffers.reverse();
            }

            return filteredOffers;
        }
    },
}
</script>

<template>
    <div class="promo-cd mt-4 d-flex flex-column">
        <div class="page-content-full pb-0 mb-3" v-if="this.chip && this.lot">
            <div class="container">
                <div class="content-with-cd">
                    <div>
                        <h1 class="fw-semibold fs-2">
                            {{ this.lot.lotname }} {{ this.chip.name }}
                        </h1>
                        <div class="block-info">
                            <p v-if="this.chip.description" style="font-weight: 300!important; font-family: sans-serif!important; font-size: 16px;" class="text-secondary">
                                {{ this.chip.description }}
                            </p>
                            <p v-else>
                                FunPay is a player-to-player marketplace where you can buy {{ this.lot.lotname }} {{ this.chip.name }} at the best price. 
                                All trades are safe and secure due to transactions protection – sellers receive their payment once they fulfill the customer’s order. 
                                Users are allowed to sell only legally obtained accounts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- {{ this.offers }} -->
        <div class="cd-container" v-if="this.lot && this.lot.image != null">
            <div class="cd">
                <img :src="'/images/lots/'+this.lot.image" alt="">
            </div>
        </div>

        

        <div class="container position-relative">
            <div class="cd-forward w-100" v-if="this.lot && this.chip">
                <div class="counter-list d-none d-sm-flex gap-2 mb-4 flex-wrap">
                    <NuxtLink style="width: 110px!important; height: 110px;" class="bg-light border border-body rounded-circle position-relative" :to="'/lots/'+chip.chipsid" v-for="chip in this.lot.chips" :key="chip._id">
                        <div class="position-absolute top-50 start-50 translate-middle">
                            {{ chip.name }}
                        </div>
                    </NuxtLink>
                </div>
                <div class="counter-list d-flex gap-2 mb-4 d-sm-none flex-wrap">
                    <NuxtLink class="bg-light rounded-pill position-relative px-3 py-2" :to="'/lots/'+chip.chipsid" v-for="chip in this.lot.chips" :key="chip._id">
                        <div>
                            {{ chip.name }}
                        </div>
                    </NuxtLink>
                </div>
                <div class="layout-swap layout-swap-disabled bg-white py-2 rounded">
                    <div class="with-tbl-footer">
                        <div class="showcase">
                            <div class="w-100">
                                <div class="mb-3">
                                    <div class="filter-btn-container d-sm-none d-flex gap-1">
                                        <div class="col-xs-6 w-100">
                                            <div class="filter-btn-container">
                                                <BDropdown offset="10" :auto-close="false" v-model="filterDropdown" size="md" variant="none" toggle-class="text-decoration-none d-flex align-items-center justify-content-between border border-primary filter-btn" no-caret>
                                                    <template #button-content> 
                                                        <span class="text-primary">Filters</span>
                                                        <span class="d-flex ms-auto">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                                                <path fill="#4384d0" d="M6 3a1 1 0 0 1 .993.883L7 4v3.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L5 20v-7.17a3 3 0 0 1-1.995-2.654L3 10l.005-.176A3 3 0 0 1 5 7.17V4a1 1 0 0 1 1-1m6 0a1 1 0 0 1 .993.883L13 4v9.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L11 20v-1.17a3 3 0 0 1-1.995-2.654L9 16l.005-.176A3 3 0 0 1 11 13.17V4a1 1 0 0 1 1-1m6 0a1 1 0 0 1 .993.883L19 4v.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L17 20V9.83a3 3 0 0 1-1.995-2.654L15 7l.005-.176A3 3 0 0 1 17 4.17V4a1 1 0 0 1 1-1" />
                                                            </svg>
                                                        </span>
                                                    </template>
                                                    <BForm class="w-100">
                                                        <BFormGroup>
                                                            <div class="d-flex gap-2 border p-1 rounded-2 align-items-center filter-btn" style="width: max-content;">
                                                                <label for="test" class="text-secondary d-flex align-items-center" style="font-size: 13px;">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                    </svg>
                                                                    <span class="d-flex text-nowrap">
                                                                        Automatic delivery
                                                                    </span>
                                                                </label>
                                                                <BFormCheckbox switch id="test" v-model="automaticDelivery"></BFormCheckbox>
                                                            </div>
                                                        </BFormGroup>
                                                    </BForm>
                                                </BDropdown>
                                            </div>
                                        </div>
                                        <div class="col-xs-6 w-100">
                                            <div>
                                                <NuxtLink v-if="this.chip" class="btn border border-primary text-primary filter-btn w-100" :to="'/lots/'+ this.chip.chipsid +'/trade'">
                                                    Trade
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-none d-sm-flex container-fluid align-items-center">
                                        <div class="d-flex align-items-center" style="width: max-content;">
                                            <BForm class="d-flex gap-2 align-items-center">
                                                <BFormGroup v-if="this.chip && this.chip.platforms">
                                                    <BFormSelect v-model="platform">
                                                        <BFormSelectOption :value="null">Platform</BFormSelectOption>
                                                        <BFormSelectOption :value="server" v-for="server in this.chip.platforms" :key="server">{{ server }}</BFormSelectOption>
                                                    </BFormSelect>
                                                </BFormGroup>
                                                <BFormGroup>
                                                    <div class="d-flex gap-2 border p-1 rounded-2 align-items-center filter-btn" style="width: max-content;">
                                                        <label for="test" class="text-secondary d-flex align-items-center gap-1" style="font-size: 13px;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                                                <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                            </svg>
                                                            <span>
                                                                Automatic delivery
                                                            </span>
                                                        </label>
                                                        <BFormCheckbox switch id="test" v-model="automaticDelivery"></BFormCheckbox>
                                                    </div>
                                                </BFormGroup>
                                            </BForm>
                                        </div>
                                        <div class="ms-auto d-flex">
                                            <NuxtLink v-if="this.chip" class="btn filter-btn border border-primary text-primary px-3" :to="'/lots/'+ this.chip.chipsid +'/trade'">
                                                Trade
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                                <table class="table position-relative" v-if="this.offers && this.users">
                                    <thead class="w-100">
                                        <tr class="">
                                            <th class="align-items-center d-none d-sm-table-cell" scope="col">Platform</th>
                                            <th class="align-items-center" scope="col" width="70%">Description</th>
                                            <th class="align-items-center d-none d-sm-table-cell" scope="col" width="25%">Seller</th>
                                            <template v-if="this.offers.length > 0">
                                                <th class="align-items-center d-flex sorting text-sm-end justify-content-end" scope="col" @click="this.asc = !this.asc; this.sortby = 'price'">Price
                                                    <template v-if="this.sortby == 'price'">
                                                        <template v-if="this.asc == false">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                <path fill="black" d="M11.293 7.293a1 1 0 0 1 1.32-.083l.094.083l6 6l.083.094l.054.077l.054.096l.017.036l.027.067l.032.108l.01.053l.01.06l.004.057L19 14l-.002.059l-.005.058l-.009.06l-.01.052l-.032.108l-.027.067l-.07.132l-.065.09l-.073.081l-.094.083l-.077.054l-.096.054l-.036.017l-.067.027l-.108.032l-.053.01l-.06.01l-.057.004L18 15H6c-.852 0-1.297-.986-.783-1.623l.076-.084z" />
                                                            </svg>
                                                        </template>
                                                        <template v-else-if="this.asc == true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                <path fill="black" d="M18 9c.852 0 1.297.986.783 1.623l-.076.084l-6 6a1 1 0 0 1-1.32.083l-.094-.083l-6-6l-.083-.094l-.054-.077l-.054-.096l-.017-.036l-.027-.067l-.032-.108l-.01-.053l-.01-.06l-.004-.057v-.118l.005-.058l.009-.06l.01-.052l.032-.108l.027-.067l.07-.132l.065-.09l.073-.081l.094-.083l.077-.054l.096-.054l.036-.017l.067-.027l.108-.032l.053-.01l.06-.01l.057-.004z" />
                                                            </svg>
                                                        </template>
                                                    </template>
                                                    <template v-else-if="sortby == 'default'">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                            <path fill="black" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 .073.082l.006.008l.016.022l.042.059l.009.015l.007.01l.014.027l.024.044l.007.017l.01.02l.012.032l.015.034l.007.025l.008.02l.005.026l.012.037l.004.028l.006.025l.003.026l.006.033l.002.03l.003.028v.026L19 10l-.002.033v.026l-.003.026l-.002.032l-.005.029l-.004.03l-.006.024l-.004.03l-.012.035l-.005.027l-.008.019l-.007.026l-.015.033l-.012.034l-.01.018l-.007.018l-.024.043l-.014.028l-.007.009l-.009.016l-.042.058l-.012.019l-.004.003l-.006.01a1 1 0 0 1-.155.154l-.009.006l-.022.016l-.058.042l-.016.009l-.009.007l-.028.014l-.043.024l-.018.007l-.018.01l-.034.012l-.033.015l-.024.006l-.021.009l-.027.005l-.036.012l-.029.004l-.024.006l-.028.003l-.031.006l-.032.002l-.026.003h-.026L18 11H6c-.89 0-1.337-1.077-.707-1.707zM18 13l.033.002h.026l.026.003l.032.002l.031.006l.028.003l.024.006l.03.004l.035.012l.027.005l.019.008l.026.007l.033.015l.034.012l.018.01l.018.007l.043.024l.028.014l.009.007l.016.009l.051.037l.026.017l.003.004l.01.006a1 1 0 0 1 .154.155l.006.009l.015.02l.043.06l.009.016l.007.009l.014.028l.024.043l.005.013l.012.023l.012.034l.015.033l.007.026l.008.02l.005.026l.012.036l.004.029l.006.024l.003.028l.006.031l.002.032l.003.026v.026L19 14l-.002.033v.026l-.003.026l-.002.032l-.006.031l-.003.028l-.006.024l-.004.03l-.012.035l-.005.027l-.008.019l-.007.026l-.015.033l-.012.034l-.01.018l-.007.018l-.024.043l-.014.028l-.007.009l-.009.016l-.042.058l-.012.019l-.004.003l-.006.01l-.073.081l-6 6a1 1 0 0 1-1.414 0l-6-6C4.663 14.077 5.109 13 6 13z" />
                                                        </svg>
                                                    </template>
                                                </th>
                                            </template>
                                            <template v-else>
                                                <th class="align-items-center d-flex" scope="col" >Price</th>   
                                            </template>
                                        </tr>
                                    </thead>
                                    <template v-if="this.offers.length > 0">
                                        <template v-if="this.sortby == 'default'">
                                            <template v-if="this.automaticDelivery == false">
                                                <tbody>
                                                <tr class="offer border-bottom" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.slice().reverse()" :key="offer.offerid">
                                                    <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                    </td>
                                                    <td class="fw-normal d-flex flex-column">
                                                        <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                        <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                    </td>
                                                    <td class="d-flex d-sm-table-cell">
                                                        <div class="media d-flex align-items-center gap-2">
                                                            <div class="media-left">
                                                                <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                </div>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="media-user-name link-dark fw-bold text-start">
                                                                    {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                </div>
                                                                <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                    {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="text-end fw-bold">
                                                        <template v-if="!offer.automatic">
                                                            {{ offer.price }}$
                                                        </template>
                                                        <template v-else>
                                                            <div class="media">
                                                                <div class="media-left fw-bold">
                                                                    {{ offer.price }}$
                                                                </div>
                                                            <div class="media-body d-flex">
                                                                <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                    <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        </template>
                                                        
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </template>
                                            <template v-if="this.automaticDelivery == true">
                                                <tbody>
                                                <tr class="offer" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.slice().reverse().filter(x=>x.automatic == true)" :key="offer.offerid">
                                                    <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                    </td>
                                                    <td class="fw-normal d-flex flex-column">
                                                        <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                        <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                    </td>
                                                    <td class="d-flex d-sm-table-cell">
                                                        <div class="media d-flex align-items-center gap-2">
                                                            <div class="media-left">
                                                                <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                </div>
                                                            </div>
                                                            <div class="media-body">
                                                                <div class="media-user-name link-dark fw-bold text-start">
                                                                    {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                </div>
                                                                <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                    {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="text-end fw-bold">
                                                        <template v-if="!offer.automatic">
                                                            {{ offer.price }}$
                                                        </template>
                                                        <template v-else>
                                                            <div class="media">
                                                                <div class="media-left fw-bold">
                                                                    {{ offer.price }}$
                                                                </div>
                                                            <div class="media-body d-flex">
                                                                <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                    <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        </template>
                                                        
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </template>
                                        </template>
                                        <template v-if="this.sortby == 'price'">
                                            <template v-if="this.automaticDelivery == false">
                                                <tbody v-if="this.asc == false">
                                                    <tr class="offer" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))" :key="offer.price">
                                                        <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                        </td>
                                                        <td class="fw-normal d-flex flex-column">
                                                            <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                            <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                        </td>
                                                        <td class="d-flex d-sm-table-cell">
                                                            <div class="media d-flex align-items-center gap-2">
                                                                <div class="media-left">
                                                                    <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <div class="media-user-name link-dark fw-bold text-start">
                                                                        {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                    </div>
                                                                    <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                        {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end fw-bold">
                                                            <template v-if="!offer.automatic">
                                                                {{ offer.price }}$
                                                            </template>
                                                            <template v-else>
                                                                <div class="media">
                                                                    <div class="media-left fw-bold">
                                                                        {{ offer.price }}$
                                                                    </div>
                                                                <div class="media-body d-flex">
                                                                    <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            </template>
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tbody v-if="this.asc == true">
                                                    <tr class="offer" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))" :key="offer.price">
                                                        <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                        </td>
                                                        <td class="fw-normal d-flex flex-column">
                                                            <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                            <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                        </td>
                                                        <td class="d-flex d-sm-table-cell">
                                                            <div class="media d-flex align-items-center gap-2">
                                                                <div class="media-left">
                                                                    <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <div class="media-user-name link-dark fw-bold text-start">
                                                                        {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                    </div>
                                                                    <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                        {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end fw-bold">
                                                            <template v-if="!offer.automatic">
                                                                {{ offer.price }}$
                                                            </template>
                                                            <template v-else>
                                                                <div class="media">
                                                                    <div class="media-left fw-bold">
                                                                        {{ offer.price }}$
                                                                    </div>
                                                                <div class="media-body d-flex">
                                                                    <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            </template>
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                            <template v-if="this.automaticDelivery == true">
                                                <tbody v-if="this.asc == false">
                                                    <tr class="offer" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).filter(x => x.automatic == true)" :key="offer.price">
                                                        <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                        </td>
                                                        <td class="fw-normal d-flex flex-column">
                                                            <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                            <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                        </td>
                                                        <td class="d-flex d-sm-table-cell">
                                                            <div class="media d-flex align-items-center gap-2">
                                                                <div class="media-left">
                                                                    <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <div class="media-user-name link-dark fw-bold text-start">
                                                                        {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                    </div>
                                                                    <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                        {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end fw-bold">
                                                            <template v-if="!offer.automatic">
                                                                {{ offer.price }}$
                                                            </template>
                                                            <template v-else>
                                                                <div class="media">
                                                                    <div class="media-left fw-bold">
                                                                        {{ offer.price }}$
                                                                    </div>
                                                                <div class="media-body d-flex">
                                                                    <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            </template>
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tbody v-if="this.asc == true">
                                                    <tr class="offer" @click="gotoffer(offer.offerid)" href="/offer/1" v-for="offer in this.offers.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).filter(x => x.automatic == true)" :key="offer.price">
                                                        <td class="d-none d-sm-table-cell" scope="row" rowspan="1">
                                                        {{ offer.server }}
                                                        </td>
                                                        <td class="fw-normal d-flex flex-column">
                                                            <div class="text-secondary fs-6 d-flex d-sm-none fw-bold">{{ offer.server }}</div>
                                                            <div class="fs-6 fs-md-2">{{ offer.shortDescription }}</div>
                                                        </td>
                                                        <td class="d-flex d-sm-table-cell">
                                                            <div class="media d-flex align-items-center gap-2">
                                                                <div class="media-left">
                                                                    <div class="avatar rounded-circle overflow-hidden" style="width: 36px; height: 36px; background-size: contain;" :style="'background-image: url(/avatars/'+users.filter(x => x.uid == offer.owner)[0].avatarName+')'">
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <div class="media-user-name link-dark fw-bold text-start">
                                                                        {{ users.filter(x => x.uid == offer.owner)[0].username }}
                                                                    </div>
                                                                    <div class="media-user-info text-secondary fw-bold text-nowrap" style="font-size: 14px; font-family: sans-serif!important;">
                                                                        {{ timeagolib.format(users.filter(x => x.uid == offer.owner)[0].registerDate) }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end fw-bold">
                                                            <template v-if="!offer.automatic">
                                                                {{ offer.price }}$
                                                            </template>
                                                            <template v-else>
                                                                <div class="media">
                                                                    <div class="media-left fw-bold">
                                                                        {{ offer.price }}$
                                                                    </div>
                                                                <div class="media-body d-flex">
                                                                    <svg class="d-flex ms-auto fs-bold" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                        <path fill="none" stroke="#4384d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            </template>
                                                            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <div class="position-absolute start-50 translate-middle mt-4" style="top: 200%;">
                                            <h1 class="mt-4">No Offers.</h1>
                                        </div>
                                    </template>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

td,th {
    border: 0;
}

.content-with-cd {
    margin-right: 330px!important;
}

@media screen and (max-width: 780px) {
    .content-with-cd {
        margin-right: 0px!important;
    }
}

.offer {
    &:hover {
        cursor: pointer;
    }
    * {
        font-weight: 300;
        font-family: sans-serif!important;
    }
}
.media-user-name {
    &:hover {
        text-decoration: underline;
    }
}

th.sorting {
    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}

.filter-btn {
    *:hover {
        cursor: pointer;
    }

    &:hover {
        background-color: #4384d030;

        label {
            color: #000!important;
        }
    }
}

.filter-btn-container {
    div {
        width: 100%;
        border-radius: 8px;
        transition: all 100ms ease;

        &:hover {
            background-color: #4384d030;
        }
    }
}

.counter-list {
    * {
        font-family: sans-serif!important;
        font-weight: 600!important;
    }
}

.router-link-active,.router-link-exact-active {
    background: #222!important;
    color: #fff!important;
}

.cd-container {
    position: absolute;
    z-index: 100;
    top: 22px;
    left: 50%;
    margin-left: 562.5px;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
}

.cd {
    position: relative!important;
    z-index: -1!important;
    border-radius: 50%!important;
    width: 800px!important;
    height: 800px!important;
    overflow: hidden!important;
}

.cd-forward {
    position: relative;
    z-index: 200;
}

.promo-cd {
    position: relative;
    overflow: hidden;
    min-height: 826px;
}

@media (max-width: 767px) {
    .cd-container {
        position: static!important;
        left: auto!important;
        top: auto!important;
        margin-left: auto!important;
        margin-right: auto!important;
        -webkit-transform: none!important;
        transform: none!important;

        .cd {
            margin: auto;
            width: 350px!important;
            height: 350px!important;
            display: flex;
            justify-content: center;
            
            img {
                display: flex;
                margin: auto;
                width: 350px!important;
                height: 350px!important;
            }
        }
    }

    .cd-forward {
        margin-top: -50%;
        padding-top: 28px;
    }
}
</style>