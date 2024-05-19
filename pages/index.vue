<script>
import {useCategoriesStore} from '~/stores/lots'

export default {
    
}
</script>


<template>
<div class="content">
        <div class="container">
            <div class="promo-games promo-games-all mt-4 gap-5" v-if="useCategoriesStore().categories">
                    <category-groups></category-groups>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .promo-games {
        display: flex;
        width: 100%;

        &-list {
            width: 100%!important;
        }
    }

    @media screen and (max-width: 768px) {
        .promo-games {
            flex-direction: row-reverse!important;
        }
    }
</style>