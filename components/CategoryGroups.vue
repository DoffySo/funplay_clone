<script>
import { useCategoriesStore } from '~/stores/lots';
import { ref } from 'vue';

export default {
    data() {
        return {
            categories: [],
            categoryLetters: [],
            groupedCategories: []
        };
    },
    methods: {
        async fetchCategories() {
            const categoryStore = useCategoriesStore();
            await categoryStore.getCategories(); // Ждем, пока категории загрузятся
            this.categories = categoryStore.categories;

            const isNumeric = str => /^\d+$/.test(str);

            const alphabetical = this.categories.filter(item => !isNumeric(item.lotname[0]));
            const numeric = this.categories.filter(item => isNumeric(item.lotname[0]));

            alphabetical.sort((a, b) => a.lotname.localeCompare(b.lotname));
            numeric.sort((a, b) => a.lotname.localeCompare(b.lotname));

            const sortedCategories = alphabetical.concat(numeric);

            const arr = [];
            for (let letter of sortedCategories) {
                if (!arr.includes(letter.lotname.charAt(0))) {
                    arr.push(letter.lotname.charAt(0));
                }
            }

            this.categoryLetters = arr;
            this.groupedCategories = sortedCategories;

            console.log(alphabetical, "!!!");
            console.log(numeric, "!!!!");
            console.log(sortedCategories, "sortedCategories");
            console.log(arr, "arr");
            console.log(sortedCategories, "sortedCategories2");
        }
    },
    async mounted() {
        const categoryStore = useCategoriesStore();

        if (categoryStore.categories.length === 0) {
            await categoryStore.getCategories();
        }
        this.fetchCategories();
    }
};
</script>

<template>
    <div class="promo-game-list-header">
        <ul class="list-unstyled d-flex flex-column" id="letters" data-bs-spy="scroll" data-bs-target="#letters" data-bs-offset="0" data-bs-smooth-scroll="true" tabindex="0">
            <li v-for="letter in categoryLetters" :key="letter" class="d-flex align-items-start" :id="'letter' + letter">
                <a style="font-family: sans-serif!important; font-size: 11px; font-weight: 600;" class="navlink link-primary mb-1" :href="'#letter' + letter">{{ letter }}</a>
                <!-- <scrollactive-item :href="'#letter' + letter">{{ letter }}</scrollactive-item> -->
            </li>
        </ul>
    </div>
    <div class="promo-game-list w-100">
        <template v-for="letter in categoryLetters" :key="letter">
            <div class="promo-game-list-title text-secondary fw-normal mb-3" style="font-family: sans-serif!important; font-size: 10px;" :id="'letters letter' + letter">{{ letter }}</div>
            <div class="row row-10 flex">
                <template v-for="category in groupedCategories" :key="category._id">
                    <template v-if="category.lotname.charAt(0).toUpperCase() === letter">
                        <div class="col-md-3 col-xs-6">
                            <div class="promo-game-item">
                                <div class="game-title">
                                    <NuxtLink class="text-dark" style="font-size: 14px;" :to="`/lots/${category.chips[0].chipsid}`" :external="true">{{ category.lotname }}</NuxtLink>
                                </div>
                                <ul class="list-unstyled list-inline gap-1 text-break d-flex flex-wrap">
                                    <!-- Отображаем элементы категории -->
                                    <li v-for="chip in category.chips" :key="chip._id" class="d-flex">
                                        <NuxtLink style="font-family: sans-serif!important; font-size: 13px;" class="link-primary d-flex align-items-center fw-normal text-nowrap" :to="`/lots/${chip.chipsid}`" :external="true">{{ chip.name }}</NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>


<style lang="scss" scoped>
    a {
        &:hover {
            text-decoration: underline!important;
        }
        &.navlink {
            &:hover {
                text-decoration: none!important;
            }
        }
    }
    .game-title {
        a {
            font-weight: semibold!important;
            font-family: 'Graphik'!important;
        }
    }
    .game-categories {
        li {
            position: relative;
            a {
                font-family: 'Helvetica Neue', sans-serif!important;
                font-size: 14px;
            }
            &:not(:last-child)::after {
                content: " .";
                vertical-align: middle;
                line-height: 1;
                display: inline-flex;
                font-weight: 300!important;
                font-family: sans-serif;
                color: #4384d0!important;
                margin-left: 3px;
            }
        }
    }

    .promo-game-item {
        ul {
            li {
                width: max-content;

                &:not(:last-child)::after {
                    content: " .";
                    vertical-align: middle;
                    line-height: .6;
                    display: inline-flex;
                    font-weight: 300!important;
                    font-family: sans-serif;
                    color: #4384d0!important;
                    margin-left: 3px;
                }
            }
        }
    }
</style>