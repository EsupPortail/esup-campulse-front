<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'
import {onMounted, ref} from 'vue'
import useSecurity from '@/composables/useSecurity'

const {isStaff, isMemberFund} = useUserGroups()
const {hasPerm} = useSecurity()

const pageCards = ref<PageCard[]>([])

const initPageCards = () => {
    pageCards.value = []
    if (isStaff.value || isMemberFund.value) {
        pageCards.value.push({
            to: {name: 'ManageProjects'},
            btnLabel: 'Gérer les subventions',
            icon: 'bi-piggy-bank',
            text: 'Lorem ipsum'
        })
        pageCards.value.push({
            to: {name: 'ArchivedCommission'},
            btnLabel: 'Consulter les archives',
            icon: 'bi-archive',
            text: 'Lorem ipsum'
        })
    }
    if (hasPerm('add_commission') && hasPerm('change_commission')
        && hasPerm('delete_commission')) {
        pageCards.value.push({
            to: {name: 'ManageCommissionDates'},
            btnLabel: 'Gérer les commissions',
            icon: 'bi-calendar',
            text: 'Lorem ipsum'
        })
    }
    if (hasPerm('add_project_association') || hasPerm('add_project_user')) {
        pageCards.value.push({
            to: {name: 'ManageProjects'},
            btnLabel: 'Gérer et déposer des projets',
            icon: 'bi-send',
            text: 'Lorem ipsum'
        })
        pageCards.value.push({
            to: {name: 'DocumentsLibrary'},
            btnLabel: 'Télécharger les documents',
            icon: 'bi-download',
            text: 'Lorem ipsum'
        })
    }
}

onMounted(initPageCards)

</script>

<template>
    <section>
        <LayoutImageText
            img="unistra.jpg"
            img-alt=""
            text="Pour les associations du site Alsace"
            title="CAPE"
        />
        <LayoutTextImageColor
            color="commission"
            img="unistra.jpg"
            img-alt=""
            text="Pour les porteurs individuels de projet"
            title="CAPE"
        />
        <LayoutPageCards
            v-if="pageCards.length"
            :page-cards="pageCards"
            color="commission"
        />
    </section>
</template>
