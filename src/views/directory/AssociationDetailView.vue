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
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

const initAssociationCharter = () => {
    let str = t('charter.association-charter-status.no-charter')
    if (association.value) {
        const charterDate = formatDate(association.value?.charterDate)
        if (charterDate) {
            const splitCharterDate = charterDate.split('-').reverse()
            const expirationDate = `${splitCharterDate[0]}/${splitCharterDate[1]}/${(parseInt(splitCharterDate[2]) + 1).toString()}`
            console.log(expirationDate)
            switch (association.value?.charterStatus) {
            case 'CHARTER_VALIDATED':
                str = t('charter.association-charter-status.validated', {expirationDate: expirationDate})
                break
            case 'CHARTER_EXPIRED':
                str = t('charter.association-charter-status.expired', {expirationDate: expirationDate})
                break
            case 'CHARTER_PROCESSING':
                str = t('charter.association-charter-status.processing')
                break
            default:
                str = t('charter.association-charter-status.no-charter')
            }
        }
    }
    associationCharterStatus.value = str
}
</script>

<template>
    <section
        class="association-detail"
        itemscope
        itemtype="https://schema.org/Organization"
    >
        <div class="dashboard-section-container">
            <div id="association-logo-title">
                <div class="association-logo">
                    <QImg
                        v-if="association"
                        :src="hasLogo ? (!association?.pathLogo?.detail?.startsWith('http') ?
                            baseUrl + association?.pathLogo?.detail : association?.pathLogo?.detail) : noLogoSquare.default"
                        aria-hidden="true"
                        itemprop="logo"
                    />
                </div>
                <div class="association-name text-center container">
                    <p
                        v-if="association?.acronym"
                        class="title-2"
                        itemprop="name"
                    >
                        {{ association?.name }}{{ t('colon') }}{{ association?.acronym }}
                    </p>
                    <!--<p>{{ t('association.labels.charter-validity') }}</p>-->
                    <p>{{ associationCharterStatus }}</p>
                    <p
                        v-if="association?.socialObject"
                        class="breakline"
                    >
                        {{ association?.socialObject }}
                    </p>
                </div>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-book"
                ></i>{{ t('association.titles.info') }}
            </h2>

            <div class="dashboard-section-container">
                <dl class="container flex-column">
                    <div
                        v-if="association?.currentProjects"
                        class="display-row"
                    >
                        <dt>{{ t('association.labels.current-projects') }}</dt>
                        <dd class="breakline">{{ association?.currentProjects }}</dd>
                    </div>

                    <div
                        v-if="association?.institution"
                        class="display-row"
                    >
                        <dt>{{ t('association.labels.institution') }}</dt>
                        <dd>
                            {{
                                associationStore.institutions.find(obj => obj.id === association?.institution)?.name
                            }}
                        </dd>
                    </div>

                    <div
                        v-if="association?.institutionComponent"
                        class="display-row"
                    >
                        <dt>{{ t('association.labels.institution-component') }}</dt>
                        <dd>
                            {{
                                associationStore.institutionComponents.find(obj => obj.id === association?.institutionComponent)?.name
                            }}
                        </dd>
                    </div>

                    <div
                        v-if="association?.activityField"
                        class="display-row"
                    >
                        <dt>{{ t('association.labels.activity-field') }}</dt>
                        <dd>
                            {{
                                associationStore.activityFields.find(obj => obj.id === association?.activityField)?.name
                            }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div
            v-if="association?.presidentNames || association?.presidentPhone || association?.presidentEmail ||
                association?.lastGoaDate || association?.siret || association?.charterDate"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-clipboard-check"
                    ></i>{{ t('association.titles.admin') }}
                </h2>

                <div class="dashboard-section-container">
                    <dl class="container flex-column">
                        <div
                            v-if="association?.presidentNames"
                            class="display-row"
                            itemprop="member"
                            itemscope
                            itemtype="https://schema.org/Person"
                        >
                            <dt>{{ t('association.labels.president-name') }}</dt>
                            <dd itemprop="name">{{ association?.presidentNames }}</dd>
                        </div>

                        <!--                        <div
                                                    v-if="association?.presidentPhone"
                                                    class="display-row"
                                                >
                                                    <dt>{{ t('association.labels.president-phone') }}</dt>
                                                    <dd>{{ association?.presidentPhone }}</dd>
                                                </div>-->

                        <div
                            v-if="association?.presidentEmail"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.president-email') }}</dt>
                            <dd>{{ association?.presidentEmail }}</dd>
                        </div>

                        <div
                            v-if="association?.charterDate"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.charter-date') }}</dt>
                            <dd>{{ formatDate(association?.charterDate)?.split('-').reverse().join('/') }}</dd>
                        </div>

                        <div
                            v-if="association?.lastGoaDate"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.last-goa') }}</dt>
                            <dd>{{ formatDate(association?.lastGoaDate)?.split('-').reverse().join('/') }}</dd>
                        </div>

                        <div
                            v-if="association?.siret"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.siret') }}</dt>
                            <dd>{{ association?.siret }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>


        <div
            v-if="association?.address || association?.phone || association?.email || association?.website ||
                (association?.socialNetworks && association?.socialNetworks?.length > 0)"
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
                        <div
                            v-if="association?.address"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.address') }}</dt>
                            <dd
                                class="address-fields"
                                itemprop="address"
                                itemscope
                                itemtype="https://schema.org/PostalAddress"
                            >
                                <span itemprop="streetAddress">{{ association?.address }}</span>
                                <span>
                                    <span itemprop="postalCode">{{ association?.zipcode }}</span>
                                    <span itemprop="addressLocality">{{ association?.city }}</span>
                                </span>
                                <span itemprop="addressCountry">{{ association?.country }}</span>
                            </dd>
                        </div>

                        <div
                            v-if="association?.phone"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.phone') }}</dt>
                            <dd itemprop="telephone">{{ association?.phone }}</dd>
                        </div>

                        <div
                            v-if="association?.email"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.mail') }}</dt>
                            <dd itemprop="email">{{ association?.email }}</dd>
                        </div>

                        <div
                            v-if="association?.website"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.website') }}</dt>
                            <dd itemprop="url">
                                <a
                                    :href="association?.website"
                                    :title="`${t('association.labels.website-link')} ${association?.name}`"
                                >{{ association?.website }}</a>
                            </dd>
                        </div>

                        <div
                            v-if="association?.socialNetworks && association?.socialNetworks?.length > 0"
                            class="display-row"
                        >
                            <dt>{{ t('association.labels.socials') }}</dt>
                            <dd>
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
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        <div
            class="flex-row-center padding-top padding-bottom"
        >
            <QBtn
                :label="t('association.back-directory')"
                :to="{name: 'Associations'}"
                class="btn-lg"
                color="association"
                icon="bi-box-arrow-left"
            />
            <QBtn
                v-if="userStore.user?.associations.find(x => x.id === association?.id)"
                :label="t('dashboard.association-user.manage-association')"
                :to="{name: 'AssociationDashboard', params: {id: association?.id}}"
                class="btn-lg"
                color="dashboard"
                icon="bi-pencil-square"
            />
            <QBtn
                v-if="association?.email"
                :href="`mailto:${association?.email}`"
                :label="t('association.contact')"
                :title="`${t('association.contact')} ${association?.name}`"
                class="btn-lg"
                color="association"
                icon="bi-envelope"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

h2 > i {
    padding: 0.25rem 1rem 0 0;
}

ul {
    padding-left: 0;
}

.breakline {
    white-space: pre-line;
}

.address-fields, .address-fields > * {
    display: flex;
    flex-direction: column;
}

.address-fields > span + span {
    flex-direction: row;
    gap: 1rem;
}
</style>
