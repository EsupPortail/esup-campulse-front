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

onMounted(async function () {
    loading.show()
    await onGetAssociationDetail()
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
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
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
                        :src="hasLogo ? (!association?.pathLogo?.detail.startsWith('http') ?
                            baseUrl + association?.pathLogo?.detail : association?.pathLogo?.detail) : noLogoSquare.default"
                        alt=""
                        aria-hidden="true"
                        itemprop="logo"
                    />
                </div>
                <div class="association-name">
                    <p
                        v-if="association?.acronym"
                        class="flex-row-center"
                        itemprop="name"
                    >
                        {{ association?.name }} ({{ association?.acronym }})
                    </p>
                    <p>{{ t('association.labels.charter-validity') }}</p>
                </div>
                <div
                    v-if="association?.socialObject"
                    class="socialObjectSection"
                >
                    <p>{{ association?.socialObject }}</p>
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
                <div class="container flex-column">
                    <div
                        v-if="association?.currentProjects"
                        class="display-row"
                    >
                        <h3>{{ t('association.labels.current-projects') }}</h3>
                        <p>{{ association?.currentProjects }}</p>
                    </div>

                    <div
                        v-if="association?.institution"
                        class="display-row"
                    >
                        <h3>{{ t('association.labels.institution') }}</h3>
                        <p>
                            {{
                                associationStore.institutions.find(obj => obj.id === association?.institution)?.name
                            }}
                        </p>
                    </div>

                    <div
                        v-if="association?.institutionComponent"
                        class="display-row"
                    >
                        <h3>{{ t('association.labels.institution-component') }}</h3>
                        <p>
                            {{
                                associationStore.institutionComponents.find(obj => obj.id === association?.institutionComponent)?.name
                            }}
                        </p>
                    </div>

                    <div
                        v-if="association?.activityField"
                        class="display-row"
                    >
                        <h3>{{ t('association.labels.activity-field') }}</h3>
                        <p>
                            {{
                                associationStore.activityFields.find(obj => obj.id === association?.activityField)?.name
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="association?.presidentNames || association?.presidentPhone || association?.lastGoaDate || association?.siret || association?.charterDate"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-clipboard-check"
                    ></i>{{ t('association.titles.admin') }}
                </h2>

                <div class="dashboard-section-container">
                    <div class="container flex-column">
                        <div
                            v-if="association?.presidentNames"
                            class="display-row"
                            itemprop="member"
                            itemscope
                            itemtype="https://schema.org/Person"
                        >
                            <h3>{{ t('association.labels.president-name') }}</h3>
                            <p itemprop="name">{{ association?.presidentNames }}</p>
                        </div>

                        <div
                            v-if="association?.presidentPhone"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.president-phone') }}</h3>
                            <p>{{ association?.presidentPhone }}</p>
                        </div>

                        <div
                            v-if="association?.charterDate"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.charter-date') }}</h3>
                            <p>{{ formatDate(association?.charterDate).split('-').reverse().join('/') }}</p>
                        </div>

                        <div
                            v-if="association?.lastGoaDate"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.last-goa') }}</h3>
                            <p>{{ formatDate(association?.lastGoaDate).split('-').reverse().join('/') }}</p>
                        </div>

                        <div
                            v-if="association?.siret"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.siret') }}</h3>
                            <p>{{ association?.siret }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div
            v-if="association?.address || association?.phone || association?.email || association?.website ||(association?.socialNetworks && association?.socialNetworks?.length > 0)"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-telephone"
                    ></i>{{ t('association.titles.contact') }}
                </h2>

                <div class="dashboard-section-container">
                    <div class="container flex-column">
                        <div
                            v-if="association?.address"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.address') }}</h3>
                            <p
                                itemprop="address"
                                itemscope
                                itemtype="https://schema.org/PostalAddress"
                            >
                                <span itemprop="streetAddress">{{ association?.address }}</span><br/>
                                <span itemprop="postalCode">{{ association?.zipcode }}</span> <span itemprop="addressLocality">{{ association?.city }}</span><br/>
                                <span itemprop="addressCountry">{{ association?.country }}</span>
                            </p>
                        </div>

                        <div
                            v-if="association?.phone"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.phone') }}</h3>
                            <p itemprop="telephone">{{ association?.phone }}</p>
                        </div>

                        <div
                            v-if="association?.email"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.mail') }}</h3>
                            <p itemprop="email">{{ association?.email }}</p>
                        </div>

                        <div
                            v-if="association?.website"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.website') }}</h3>
                            <a
                                :href="association?.website"
                                :title="`${t('association.labels.website-link')} ${association?.name}`"
                                itemprop="url"
                            >
                                {{ association?.website }}
                            </a>
                        </div>

                        <div
                            v-if="association?.socialNetworks && association?.socialNetworks?.length > 0"
                            class="display-row"
                        >
                            <h3>{{ t('association.labels.socials') }}</h3>
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
                        </div>
                    </div>
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
                v-if="userStore.user?.associations.find(x => x.id === association.id)"
                :label="t('dashboard.association-user.manage-association')"
                :to="{name: 'AssociationDashboard', params: {id: association.id}}"
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
</style>
