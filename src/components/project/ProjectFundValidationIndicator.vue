<script lang="ts" setup>
import type {ProjectCommissionFund} from '#/project'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'

const props = defineProps<{
    projectCommissionFunds: ProjectCommissionFund[]
}>()

const {t} = useI18n()
const {commissionFunds, funds} = useCommissions()
const {CURRENCY} = useUtility()

</script>

<template>
    <ul v-if="props.projectCommissionFunds.length">
        <li
            v-for="commissionFund in props.projectCommissionFunds"
            :key="commissionFund.id"
        >
            {{
                funds.find(x => x.id === (commissionFunds.find
                    (y => y.id === commissionFund.commissionFund)?.fund))?.acronym
            }}
            <span
                v-if="commissionFund.isValidatedByAdmin"
                class="form-state form-state-cape"
            >
                <span
                    class="form-state-icon form-state-green"
                >
                    <i
                        :aria-label="t('validated')"
                        class="bi bi-check"
                    ></i>
                </span>
                <span v-if="commissionFund.amountEarned || commissionFund.amountEarned === 0">
                    {{ ` (${commissionFund.amountEarned} ${CURRENCY})` }}
                </span>
            </span>
            <span
                v-if="commissionFund.isValidatedByAdmin === false"
                class="form-state form-state-cape"
            >
                <span
                    class="form-state-icon form-state-red"
                >
                    <i
                        :aria-label="t('rejected')"
                        class="bi bi-x"
                    ></i>
                </span>
            </span>
            <span
                v-if="commissionFund.isValidatedByAdmin === null"
                class="form-state form-state-cape"
            >
                <span
                    class="form-state-icon form-state-grey"
                >
                    <i
                        :aria-label="t('validation-pending')"
                        class="bi bi-dash"
                    ></i>
                </span>
            </span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

ul {
    padding-left: 0;
}

li {
    list-style: none;
    white-space: nowrap;
}
</style>
