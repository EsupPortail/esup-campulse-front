<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUtility from '@/composables/useUtility'
import {useRoute} from 'vue-router'
import useAssociation from '@/composables/useAssociation'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {formatDate, dynamicTitle} = useUtility()
const route = useRoute()
const associationStore = useAssociationStore()
const {altLogoText} = useAssociation()
const {catchHTTPError} = useErrors()

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})

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
    <div id="association-detail">
        <section id="association-logo-title">
            <div class="association-logo">
                <QImg
                    v-if="association"
                    :alt="altLogoText(association)"
                    :src="hasLogo ? association?.pathLogo?.detail : noLogoSquare.default"
                />
            </div>
            <div class="association-name">
                <!--<h2>{{ association?.name }}</h2>-->
                <p
                    v-if="association?.acronym"
                    class="acronym"
                >
                    {{ association?.acronym }}
                </p>
                <p>{{ t('association.labels.charter-validity') }}</p>
            </div>

            <div
                v-if="association?.socialObject"
                class="socialObjectSection"
            >
                <p>{{ association?.socialObject }}</p>
            </div>
        </section>

        <section>
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-book"
                ></i>{{ t('association.titles.info') }}
            </h3>

            <div class="form-container">
                <article
                    v-if="association?.currentProjects"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.current-projects') }}</h4>
                    <p>{{ association?.currentProjects }}</p>
                </article>

                <article
                    v-if="association?.institution"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.institution') }}</h4>
                    <p>{{ associationStore.institutions.find(obj => obj.id === association?.institution)?.name }}</p>
                </article>

                <article
                    v-if="association?.institutionComponent"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.institution-component') }}</h4>
                    <p>
                        {{
                            associationStore.institutionComponents.find(obj => obj.id === association?.institutionComponent)?.name
                        }}
                    </p>
                </article>

                <article
                    v-if="association?.activityField"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.activity-field') }}</h4>
                    <p>
                        {{
                            associationStore.activityFields.find(obj => obj.id === association?.activityField)?.name
                        }}
                    </p>
                </article>
            </div>
        </section>

        <section
            v-if="association?.presidentNames || association?.presidentPhone || association?.lastGoaDate || association?.siret"
        >
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-clipboard-check"
                ></i>{{ t('association.titles.admin') }}
            </h3>

            <div class="form-container">
                <article
                    v-if="association?.presidentNames"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.president-name') }}</h4>
                    <p>{{ association?.presidentNames }}</p>
                </article>

                <article
                    v-if="association?.presidentPhone"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.president-phone') }}</h4>
                    <p>{{ association?.presidentPhone }}</p>
                </article>

                <article class="display-row">
                    <h4>{{ t('association.labels.charter-date') }}</h4>
                    <p>TODO</p>
                </article>

                <article
                    v-if="association?.lastGoaDate"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.last-goa') }}</h4>
                    <p>{{ formatDate(association?.lastGoaDate) }}</p>
                </article>

                <article
                    v-if="association?.siret"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.siret') }}</h4>
                    <p>{{ association?.siret }}</p>
                </article>
            </div>
        </section>

        <section
            v-if="association?.address || association?.phone || association?.email || association?.website ||
                (association?.socialNetworks && association?.socialNetworks?.length > 0)"
        >
            <h3>
                <i
                    aria-hidden="true"
                    class="bi bi-telephone"
                ></i>{{ t('association.titles.contact') }}
            </h3>

            <div class="form-container">
                <article
                    v-if="association?.address"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.address') }}</h4>
                    <p>
                        {{ association?.address }}<br/>
                        {{ association?.zipcode + ' ' + association?.city }}<br/>
                        {{ association?.country }}
                    </p>
                </article>

                <article
                    v-if="association?.phone"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.phone') }}</h4>
                    <p>{{ association?.phone }}</p>
                </article>

                <article
                    v-if="association?.email"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.mail') }}</h4>
                    <p>{{ association?.email }}</p>
                </article>

                <article
                    v-if="association?.website"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.website') }}</h4>
                    <a
                        :href="association?.website"
                        :title="`${t('association.labels.website-link')} ${association?.name}`"
                    >
                        {{ association?.website }}
                    </a>
                </article>

                <article
                    v-if="association?.socialNetworks && association?.socialNetworks?.length > 0"
                    class="display-row"
                >
                    <h4>{{ t('association.labels.socials') }}</h4>
                    <ul>
                        <li
                            v-for="(socialNetwork, index) in association?.socialNetworks"
                            :key="index"
                        >
                            <a :href="socialNetwork?.location">
                                {{ socialNetwork?.type }}
                            </a>
                        </li>
                    </ul>
                </article>
            </div>
        </section>

        <div
            id="bottom-btns"
            class="btn-group"
        >
            <QBtn
                :label="t('association.back-directory')"
                :to="{name: 'Associations'}"
                icon="bi-box-arrow-right"
            />
            <QBtn
                v-if="association?.email"
                :href="`mailto:${association?.email}`"
                :label="t('association.contact')"
                :title="`${t('association.contact')} ${association?.name}`"
                icon="bi-enveloppe"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
</style>
