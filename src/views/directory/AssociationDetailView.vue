<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUtility from '@/composables/useUtility'
import {useRoute} from 'vue-router'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useUserStore} from '@/stores/useUserStore'
import AtomicDisplayField from '@/components/atomic/AtomicDisplayField.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import router from '@/router'
import type {AssociationCharterStatus} from '#/charters'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {formatDate, dynamicTitle} = useUtility()
const route = useRoute()
const associationStore = useAssociationStore()
const userStore = useUserStore()
const {catchHTTPError} = useErrors()

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const associationCharterStatus = ref<string>('')

onMounted(async function () {
    loading.show()
    await onGetAssociationDetail()
    initAssociationCharter()
    dynamicTitle.value = associationStore.association?.name
    loading.hide()
})

const hasLogo = computed(() => {
    return association.value ? (association.value.pathLogo !== null && Object.keys(association.value.pathLogo).length > 0) : false
})

async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

const initAssociationCharter = () => {
    let str: string
    const charterStatus: AssociationCharterStatus = association.value?.charterStatus
    const expirationDate: string = formatDate(association.value?.calculatedExpirationDate)
    if (['CHARTER_VALIDATED', 'CHARTER_EXPIRED', 'CHARTER_PROCESSING'].includes(charterStatus)) {
        str = t(`charter.association-charter-status.${charterStatus?.split('_')[1].toLowerCase()}`,
            {expirationDate: expirationDate.split('-').reverse().join('/')})
    } else {
        str = t('charter.association-charter-status.no-charter')
    }
    associationCharterStatus.value = str
}
</script>

<template>
    <div class="association-detail">
        <div class="dashboard-section-container">
            <div class="association-logo">
                <QImg
                    v-if="association"
                    :src="hasLogo ? (!association?.pathLogo?.detail?.startsWith('http') ?
                        baseUrl + association?.pathLogo?.detail : association?.pathLogo?.detail) : noLogoSquare.default"
                    aria-hidden="true"
                />
            </div>
            <div class="text-center container padding-left padding-right">
                <p
                    v-if="association?.acronym"
                    class="title-2"
                >
                    {{ association?.name }}{{ t('colon') }}{{ association?.acronym }}
                </p>
                <p>{{ associationCharterStatus }}</p>
                <p v-if="association?.socialObject">{{ association?.socialObject }}</p>
            </div>
        </div>

        <section class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-book"
                ></i>{{ t('association.titles.info') }}
            </h2>

            <div class="dashboard-section-container">
                <dl class="container flex-column">
                    <AtomicDisplayField
                        v-if="association?.currentProjects"
                        :title="t('association.labels.current-projects')"
                        color="association"
                    >
                        {{ association?.currentProjects }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.institution"
                        :title="t('association.labels.institution')"
                        color="association"
                    >
                        {{ association?.institution.name }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.institutionComponent"
                        :title="t('association.labels.institution-component')"
                        color="association"
                    >
                        {{ association?.institutionComponent.name }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.activityField"
                        :title="t('association.labels.activity-field')"
                        color="association"
                    >
                        {{ association?.activityField.name }}
                    </AtomicDisplayField>
                </dl>
            </div>
        </section>

        <section
            v-if="association?.presidentNames || association?.lastGoaDate || association?.siret || association?.charterDate"
            class="dashboard-section"
        >
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-clipboard-check"
                ></i>{{ t('association.titles.admin') }}
            </h2>

            <div class="dashboard-section-container">
                <dl class="container flex-column">
                    <AtomicDisplayField
                        v-if="association?.presidentNames"
                        :title="t('association.labels.president-name')"
                        color="association"
                    >
                        {{ association?.presidentNames }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.charterDate"
                        :title="t('association.labels.charter-date')"
                        color="association"
                    >
                        {{ formatDate(association?.charterDate)?.split('-').reverse().join('/') }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.lastGoaDate"
                        :title="t('association.labels.last-goa')"
                        color="association"
                    >
                        {{ formatDate(association?.lastGoaDate)?.split('-').reverse().join('/') }}
                    </AtomicDisplayField>
                    <AtomicDisplayField
                        v-if="association?.siret"
                        :title="t('association.labels.siret')"
                        color="association"
                    >
                        {{ association?.siret }}
                    </AtomicDisplayField>
                </dl>
            </div>
        </section>

        <div
            v-if="association?.address || association?.phone || (association?.email && !association?.email.includes('@mail.tld'))
                || association?.website || (association?.socialNetworks && association?.socialNetworks?.length > 0)"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-telephone"
                    ></i>{{ t('association.titles.contact') }}
                </h2>

                <div class="dashboard-section-container">
                    <dl class="container flex-column">
                        <AtomicDisplayField
                            v-if="association?.address"
                            :title="t('association.labels.address')"
                            color="association"
                        >
                            <div class="flex-column no-gap">
                                <span>{{ association?.address }}</span>
                                <span class="flex-row gap-sm">
                                    <span>{{ association?.zipcode }}</span>
                                    <span>{{ association?.city }}</span>
                                </span>
                                <span>{{ association?.country }}</span>
                            </div>
                        </AtomicDisplayField>
                        <AtomicDisplayField
                            v-if="association?.phone"
                            :title="t('association.labels.phone')"
                            color="association"
                        >
                            {{ association?.phone }}
                        </AtomicDisplayField>
                        <AtomicDisplayField
                            v-if="association?.email && !association?.email?.includes('@mail.tld')"
                            :title="t('association.labels.mail')"
                            color="association"
                        >
                            {{ association?.email }}
                        </AtomicDisplayField>
                        <AtomicDisplayField
                            v-if="association?.website"
                            :title="t('association.labels.website')"
                            color="association"
                        >
                            <a
                                :href="association?.website"
                                :title="`${t('association.labels.website-link')} ${association?.name}`"
                            >{{
                                association?.website
                            }}</a>
                        </AtomicDisplayField>
                        <AtomicDisplayField
                            v-if="association?.socialNetworks.length"
                            :title="t('association.labels.socials')"
                            color="association"
                        >
                            <ul class="flex-row">
                                <li
                                    v-for="(socialNetwork, index) in association?.socialNetworks"
                                    :key="index"
                                >
                                    <a :href="socialNetwork?.location">
                                        {{ socialNetwork?.type }}
                                    </a>
                                </li>
                            </ul>
                        </AtomicDisplayField>
                    </dl>
                </div>
            </div>
        </div>

        <div class="flex-row-center padding-top padding-bottom">
            <AtomicButton
                :label="t('association.back-directory')"
                color="association"
                icon="bi-box-arrow-left"
                @click="router.push({ name: 'Associations' })"
            />
            <AtomicButton
                v-if="userStore.user?.associations.find(x => x.id === association?.id)"
                :label="t('dashboard.association-user.manage-association')"
                color="dashboard"
                icon="bi-pencil-square"
                @click="router.push({ name: 'AssociationDashboard', params: { id: association?.id } })"
            />
            <AtomicButton
                v-if="association?.email && !association?.email?.includes('@mail.tld')"
                :aria-label="`${t('association.contact')} ${association?.name}`"
                :href="`mailto:${association?.email}`"
                :label="t('association.contact')"
                color="association"
                icon="bi-envelope"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

.association-logo {
    width: 12rem;
    height: 12rem;
    display: block;
    margin: 1rem auto;
}

h2 > i {
    padding: 0.25rem 1rem 0 0;
}
</style>
