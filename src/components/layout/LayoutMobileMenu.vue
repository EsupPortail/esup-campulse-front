<script lang="ts" setup>
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import useUtility from '@/composables/useUtility.ts'

const {openMenu} = useUtility()
</script>

<template>
    <div class="mobile-menu">
        <div
            :class="`flex-row-right mobile-nav-bar ${openMenu ? '' : 'box-shadow'}`"
        >
            <QBtn
                :icon-right="openMenu ? 'bi-x' : 'bi-list'"
                label="Menu"
                outline
                @click="openMenu = !openMenu"
            />
        </div>
        <div
            :class="openMenu ? 'open-menu box-shadow' : 'close-menu'"
        >
            <LayoutHeaderNav device="mobile"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.mobile-menu {
    display: none;
}

@media screen and (max-width: 830px) {
    .mobile-menu {
        display: block;
    }

    .mobile-nav-bar {
        background-color: #fff;
        width: 100%;
        position: fixed;
        padding: 0.5rem;
        bottom: 0;
        height: 5rem;
        z-index: 9999999;
        color: $textColor1;
    }

    .box-shadow {
        box-shadow: 0px -1px 5px 2px rgba(225, 225, 225, 0.54);
        -webkit-box-shadow: 0px -1px 5px 2px rgba(225, 225, 225, 0.54);
        -moz-box-shadow: 0px -1px 5px 2px rgba(225, 225, 225, 0.54);
        transition: box-shadow 0.2s ease-out;
    }

    .mobile-menu > div + div {
        position: fixed;
        background-color: $backgroundColor2;
        width: 100%;
        color: $textColor1;
        padding: 1rem;
        transition: all 0.2s ease-out;
        bottom: 5rem;
    }

    .close-menu {
        visibility: hidden;
    }

    .open-menu {
        visibility: visible;
        z-index: 10;
    }
}
</style>
