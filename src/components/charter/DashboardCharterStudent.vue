<script lang="ts" setup>

import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const columns = [
    {name: 'charter', align: 'left', label: t('charter.table-title'), field: 'charter', sortable: true},
    {name: 'status', align: 'right', label: t('status'), field: 'status', sortable: true},
    {name: 'edition', align: 'center', label: t('manage'), field: 'edition', sortable: false}
]

</script>

<template>
    <section class="dashboard-section">
        <h2 class="dashboard-section-title">
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            Titre de la section
        </h2>
        <div class="dashboard-section-container">
            <div class="table">
                <QTable
                    :columns="columns"
                    :rows="rows"
                    row-key="name"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.dashboard-section-title {
    background-color: transparent;
    font-size: $headTitleMobileSize;
    text-transform: uppercase;
    color: $annuaireColorText;
    line-height: 3rem;
    margin-left: 1rem;

    i {
        color: $annuaireColorText;
        font-size: $headTitleMobileSize;
        margin-right: 0.300rem;
        position: relative;
        top: -0.188rem;
    }
}

.dashboard-section-container {
    max-width: 1280px;
    width: 100%;
    margin: auto;
    padding: 1rem 0;
}
</style>