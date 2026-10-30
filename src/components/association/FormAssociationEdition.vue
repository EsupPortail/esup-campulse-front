<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {type QFile, useQuasar} from 'quasar'
import {useAssociation} from '@/composables/useAssociation'
import FormAssociationSocialNetworks from '@/components/association/FormAssociationSocialNetworks.vue'
import axios from 'axios'
import useUserGroups from '@/composables/useUserGroup'
import useSecurity from '@/composables/useAuthentication'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import useErrors from '@/composables/useError'
import InfoFormRequiredFields from '@/components/global/InfoFormRequiredFields.vue'
import useDocuments from '@/composables/useDocument'
import useUtil from '@/composables/useUtil'
import {useInstitutionStore} from '@/stores/useInstitutionStore'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {phoneRegex, urlRegex} = useUtil()
const {
  newLogo,
  pathLogo,
  maxFileSize,
  editedAssociation,
  associationMemberCount
} = useAssociation()
const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()
const {acceptedFormats} = useDocuments()

const associationStore = useAssociationStore()
const institutionStore = useInstitutionStore()

const baseUrl = import.meta.env.VITE_APP_BASE_URL

// FILE TOO LARGE OR NOT IN THE RIGHT FORMAT
async function onLogoRejected(rejectedEntries: { failedPropValidation: string, file: File }[]) {
  rejectedEntries.forEach(entry => {
    if (entry.failedPropValidation === 'accept') {
      notify({
        type: 'negative',
        message: t('notifications.negative.error-mimetype')
      })
    }
    if (entry.failedPropValidation === 'max-file-size') {
      notify({
        type: 'negative',
        message: t('notifications.negative.error-413')
      })
    }
  })
}

// Update association logo details
async function onChangeLogo(action: string) {
  loading.show()
  try {
    if (action === 'update') {
      await associationStore.updateAssociationLogo(newLogo.value, null)
    } else if (action === 'delete') {
      const deleteLogoData = {'pathLogo': null}
      await associationStore.updateAssociationLogo(undefined, deleteLogoData)
      newLogo.value = undefined
    }
    notify({
      type: 'positive',
      message: t('notifications.positive.association-logo-updated')
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}
</script>

<template>
  <QForm
    class="association-edition padding-left padding-right padding-bottom"
    @submit.prevent="onChangeLogo('update')"
  >
    <div id="association-logo-title">
      <div class="association-logo">
        <QImg
          :src="(pathLogo && Object.keys(pathLogo).length > 0) ?
            (pathLogo.detail ? (!pathLogo.detail.startsWith('http')
              ? baseUrl + pathLogo.detail : pathLogo.detail) : noLogoSquare.default) : noLogoSquare.default"
          aria-hidden="true"
        />
      </div>

      <div class="container">
        <div class="association-name text-center">
          <p
            v-if="editedAssociation?.acronym"
            class="acronym"
          >
            {{ editedAssociation?.acronym }}
          </p>
        </div>

        <QFile
          v-model="newLogo"
          :label="t('association.logo.pickup')"
          :max-file-size="maxFileSize"
          accept="image/png, image/jpeg"
          bottom-slots
          clearable
          filled
          for="pathFile"
          @rejected="onLogoRejected"
        >
          <template v-slot:hint>
            <p aria-describedby="pathFile">
              {{
                t('forms.accepted-formats') + acceptedFormats(['image/png', 'image/jpeg']) + '.'
              }}
            </p>
          </template>
          <template v-slot:prepend>
            <QIcon name="bi-image"/>
          </template>
        </QFile>

        <div class="flex-row-space-between align-items-stretch">
          <QBtn
            :label="t('association.logo.update')"
            class="btn-lg"
            color="association"
            icon="bi-check-lg"
            outline
            type="submit"
          />
          <QBtn
            :label="t('association.logo.remove')"
            class="btn-lg"
            color="custom-red"
            icon="bi-trash"
            outline
            @click="onChangeLogo('delete')"
          />
        </div>
      </div>
    </div>
  </QForm>

  <QForm class="association-edition">
    <!-- Informations -->
    <div class="dashboard-section">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-book"
        ></i>{{ t('association.titles.info') }}
      </h2>

      <div class="dashboard-section-container">
        <div class="container flex-column">
          <InfoFormRequiredFields/>
          <QInput
            v-model="editedAssociation.name"
            :disable=!isStaff
            :label="t('association.labels.name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-association-name')]"
            aria-required="true"
            clearable
            filled
            lazy-rules
          />
          <QInput
            v-model="editedAssociation.acronym"
            :label="t('association.labels.acronym')"
            clearable
            filled
          />
          <QInput
            v-model="editedAssociation.socialObject"
            :label="t('association.labels.social-object')"
            bottom-slots
            clearable
            filled
            for="socialObject"
            type="textarea"
          >
            <template v-slot:hint>
              <p aria-describedby="socialObject">{{ t('forms.social-object-hint') }}</p>
            </template>
          </QInput>
          <QInput
            v-model="editedAssociation.currentProjects"
            :label="t('association.labels.current-projects')"
            clearable
            filled
            type="textarea"
          />
          <div
            v-if="!isStaff"
            class="info-panel info-panel-warning"
          >
            <i
              aria-hidden="true"
              class="bi bi-info"
            ></i>
            <p>
              {{ t('forms.info-modify-association-institution') }}
            </p>
          </div>
          <QSelect
            v-model="editedAssociation.institution"
            :disable="!isStaff"
            :label="t('association.labels.institution') + ' *'"
            :options="institutionStore.institutionLabels"
            :rules="[val => val || t('forms.required-association-institution')]"
            aria-required="true"
            clearable
            emit-value
            filled
            map-options
            @update:model-value="editedAssociation.institutionComponent = null"
          />
          <QSelect
            v-model="editedAssociation.institutionComponent"
            :label="t('association.labels.institution-component')"
            :options="institutionStore.institutionComponentLabels
              .filter(obj => obj.institution === editedAssociation.institution)"
            clearable
            emit-value
            filled
            map-options
          />
          <QSelect
            v-model="editedAssociation.activityField"
            :label="t('association.labels.activity-field')"
            :options="associationStore.activityFieldLabels"
            clearable
            emit-value
            filled
            map-options
          />
        </div>
      </div>
    </div>

    <!-- Administration -->
    <div class="dashboard-section">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-clipboard-check"
        ></i>{{ t('association.titles.admin') }}
      </h2>

      <div class="dashboard-section-container">
        <div class="container flex-column">
          <QInput
            v-model="editedAssociation.presidentNames"
            :label="t('association.labels.president-name')"
            clearable
            filled
          />
          <QInput
            v-model="editedAssociation.presidentPhone"
            :label="t('association.labels.president-phone')"
            :rules="editedAssociation.presidentPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
            clearable
            filled
            type="tel"
          />
          <QInput
            v-model="editedAssociation.presidentEmail"
            :label="t('association.labels.president-email')"
            clearable
            filled
            type="email"
          />
          <QInput
            v-model="editedAssociation.lastGoaDate"
            :label="t('association.labels.last-goa')"
            clearable
            filled
            max="2120-01-01"
            min="1970-01-01"
            type="date"
          >
            <template v-slot:prepend>
              <QIcon name="bi-calendar"/>
            </template>
          </QInput>
          <QInput
            v-model="editedAssociation.siret"
            :label="t('association.labels.siret')"
            clearable
            filled
            inputmode="numeric"
            maxlength="14"
          />
          <QInput
            v-if="hasPerm('change_association_all_fields')"
            v-model="editedAssociation.amountMembersAllowed"
            :label="t('association.labels.amount-members-allowed')"
            :rules="[val => Number.parseInt(val) >= associationMemberCount || t('forms.amount-members-allowed-must-be-superior-to-members')]"
            bottom-slots
            clearable
            filled
            for="amountMembersAllowed"
            inputmode="numeric"
            lazy-rules
            min="0"
            type="number"
          >
            <template v-slot:hint>
              <p aria-describedby="amountMembersAllowed">
                {{
                  t('forms.amount-student-allowed-cannot-be-inferior-to-members', {amount: associationMemberCount})
                }}
              </p>
            </template>
          </QInput>
          <QInput
            v-model="editedAssociation.studentCount"
            :label="t('forms.association-student-count')"
            clearable
            filled
            inputmode="numeric"
            min="0"
            type="number"
          />
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="dashboard-section">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-telephone"
        ></i>{{ t('association.titles.contact') }}
      </h2>

      <div class="dashboard-section-container">
        <div class="container flex-column">
          <fieldset class="address-fields flex-column">
            <legend class="padding-bottom">{{ t('association.labels.address') }}</legend>
            <QInput
              v-model="editedAssociation.address"
              :label="t('association.labels.address')"
              clearable
              filled
            />
            <div>
              <QInput
                v-model="editedAssociation.zipcode"
                :label="t('address.zipcode')"
                clearable
                filled
              />
              <QInput
                v-model="editedAssociation.city"
                :label="t('address.city')"
                clearable
                filled
              />
              <QInput
                v-model="editedAssociation.country"
                :label="t('address.country')"
                clearable
                filled
              />
            </div>
          </fieldset>
          <QSeparator aria-hidden="true"/>
          <QInput
            v-model="editedAssociation.email"
            :label="t('association.labels.mail')"
            :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
            aria-required="true"
            clearable
            filled
            lazy-rules
            type="email"
          />
          <QInput
            v-model="editedAssociation.phone"
            :label="t('association.labels.phone')"
            :rules="editedAssociation.phone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
            clearable
            filled
            type="tel"
          />
          <QInput
            v-model="editedAssociation.website"
            :label="t('association.labels.website')"
            :rules="editedAssociation.website ? [val => urlRegex.test(val) || t('forms.required-valid-url')] : []"
            clearable
            filled
            type="url"
          />
        </div>
      </div>
    </div>

    <div class="dashboard-section">
      <h2>
        <i
          aria-hidden="true"
          class="bi bi-megaphone"
        ></i>{{ t('association.labels.socials') }}
      </h2>

      <div class="dashboard-section-container">
        <div class="container">
          <FormAssociationSocialNetworks/>
        </div>
      </div>
    </div>
  </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations';
@import '@/assets/styles/forms';
@import '@/assets/styles/dashboard';
@import "@/assets/variables";

.address-fields > div {
  display: flex;
  gap: 1rem;
  width: $fullSize;

  & > * {
    width: $fullSize;
  }

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.q-separator {
  margin: 0.5rem 0 1rem 0;
}

.flex-column {
  gap: 1.5rem;
}

.dashboard-section h2 {
  display: flex;
  gap: 1rem;
}
</style>
