<script lang="ts" setup>
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useError'
import router from '@/router'
import {computed, onMounted, ref} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import useProject from '@/composables/useProject'
import {useRoute} from 'vue-router'
import useUtil from '@/composables/useUtil'
import ProjectStatusIndicator from '@/components/project/ProjectStatusIndicator.vue'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'
import ProjectExpansionItem from '@/components/project/projectDetail/ProjectExpansionItem.vue'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useCharter from '@/composables/useCharter'
import ProjectCategories from '@/components/project/ProjectCategories.vue'
import ProjectBudget from '@/components/project/ProjectBudget.vue'
import ProjectGoals from '@/components/project/ProjectGoals.vue'
import ProcessDocumentList from '@/components/documents/ProcessDocumentList.vue'
import ProjectComments from '@/components/project/ProjectComments.vue'
import useProjectReview from '@/composables/useProjectReview'
import ProjectReviewRecap from '@/components/project/ProjectReviewRecap.vue'

const {notify, loading} = useQuasar()
const {initAssociationCharterStatus} = useCharter()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {openDocument, formatDate, reverseDate} = useUtil()
const projectStore = useProjectStore()
const {
  initProjectBasicInfos,
  initProjectGoals,
  initProjectBudget
} = useProject()
const {initProjectReview} = useProjectReview()
const route = useRoute()

const isLoaded = ref<boolean>(false)

const showReview = computed<boolean>(() => {
  return ['PROJECT_REVIEW_PROCESSING', 'PROJECT_REVIEW_VALIDATED', 'PROJECT_CANCELED']
    .includes(projectStore.projectStatus)
})

onMounted(async () => {
  loading.show()
  await onGetData()
  isLoaded.value = true
  loading.hide()
})

async function onGetData() {
  try {
    await projectStore.getProjectDetail(Number.parseInt(route.params.projectId as string))
    initProjectBasicInfos()
    initProjectBudget()
    initProjectGoals()
    if (showReview.value) {
      await projectStore.getProjectReview()
      initProjectReview()
    }
  } catch (error) {
    await router.push({name: '404'})
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

async function onGetProjectPdf() {
  loading.show()
  try {
    const response = await projectStore.getProjectPdf()
    openDocument(response)
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
  <div class="dashboard-section">
    <div class="flex-row-space-between">
      <div>
        <h2>
          <i
            aria-hidden="true"
            class="bi bi-journal-bookmark"
          ></i>
          {{ projectStore.project?.name }}
        </h2>
        <div>
          <ProjectStatusIndicator
            :project-status="projectStore.project?.projectStatus"
            :show-draft="true"
          />
        </div>
      </div>
      <QBtn
        color="commission"
        disable
        icon="bi-pencil"
        label="Éditer"
        outline
      />
    </div>
    <div class="dashboard-section-container">
      <div class="container flex-column gap-m">
        <section>
          <dl class="flex-column">
            <div>
              <GlobalDefinition
                v-if="projectStore.project?.association"
                title="Association"
              >
                {{
                  `${projectStore.project?.association.name}
 (${projectStore.project?.associationUser.user.firstName + ' ' + projectStore.project?.associationUser.user.lastName})`
                }}
              </GlobalDefinition>
              <GlobalDefinition
                v-else
                title="Porteur"
              >
                {{ projectStore.project?.user.firstName + ' ' + projectStore.project?.user.lastName }}
              </GlobalDefinition>
              <GlobalDefinition
                v-if="projectStore.project?.partnerAssociation"
                title="Association co-porteuse"
              >
                {{ projectStore.project?.partnerAssociation }}
              </GlobalDefinition>
              <GlobalDefinition
                v-if="projectStore.project?.association"
                title="Statut de la charte"
              >
                <CharterStatusIndicator
                  :charter-status="initAssociationCharterStatus(projectStore.project?.association.charterStatus)"
                />
              </GlobalDefinition>
              <GlobalDefinition title="Bilans en retard">
                TODO
              </GlobalDefinition>
            </div>
            <div>
              <GlobalDefinition title="Date de dépôt du projet">
                {{ reverseDate(formatDate(projectStore.project?.creationDate)) }}
              </GlobalDefinition>
              <GlobalDefinition title="Date de dernière modification">
                {{ reverseDate(formatDate(projectStore.project?.editionDate)) }}
              </GlobalDefinition>
              <GlobalDefinition title="Date de début du projet">
                {{ reverseDate(formatDate(projectStore.project?.plannedStartDate)) }}
              </GlobalDefinition>
              <GlobalDefinition title="Date de fin du projet">
                {{ reverseDate(formatDate(projectStore.project?.plannedEndDate)) }}
              </GlobalDefinition>
              <GlobalDefinition title="Catégorie">
                <ProjectCategories/>
              </GlobalDefinition>
            </div>
            <div>
              <GlobalDefinition title="Lieux prévus">
                {{ projectStore.project?.plannedLocation }}
              </GlobalDefinition>
            </div>
            <div>
              <GlobalDefinition title="Commission">
                {{ projectStore.project?.commission.name }}
              </GlobalDefinition>
            </div>
            <div>
              <table>
                <caption>Financeurs et montants</caption>
                <tbody>
                  <tr>
                    <th>Fonds</th>
                    <th>Statut</th>
                    <th>Montant demandé</th>
                    <th>Montant obtenu</th>
                  </tr>
                  <tr>
                    <td>TODO</td>
                    <td>TODO</td>
                    <td>TODO</td>
                    <td>TODO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </dl>
        </section>
        <section>
          <QList
            bordered
            class="rounded-borders bg-white"
          >
            <ProjectExpansionItem
              icon="bi-gear"
              label="Paramètres du projet"
            >
              TODO
            </ProjectExpansionItem>
            <ProjectExpansionItem
              icon="bi-send"
              label="Autres projets du porteur"
            >
              TODO
            </ProjectExpansionItem>
            <ProjectExpansionItem
              icon="bi-clipboard"
              label="Détails du projet"
            >
              <section class="flex-column">
                <h4>
                  {{ t('project.budget') }}
                </h4>
                <ProjectBudget/>
                <h4>
                  Objectifs
                </h4>
                <ProjectGoals/>
              </section>
            </ProjectExpansionItem>
            <ProjectExpansionItem
              :disable="!showReview"
              icon="bi-person-video3"
              label="Détails du bilan"
            >
              <ProjectReviewRecap view="projectReviewDetail"/>
            </ProjectExpansionItem>
            <ProjectExpansionItem
              icon="bi-file-earmark"
              label="Documents du projet"
            >
              <ProcessDocumentList
                v-if="isLoaded"
                :association-id="null"
                process="project"
              />
            </ProjectExpansionItem>
            <ProjectExpansionItem
              icon="bi-chat"
              label="Commentaires"
            >
              <ProjectComments
                v-if="isLoaded"
                :project="projectStore.project?.id"
              />
            </ProjectExpansionItem>
          </QList>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.flex-row-space-between {
  width: $fullSize;
  max-width: 120rem;
  padding: 0 1rem 1rem 1rem;
  margin: auto;

  h2 {
    padding: 1rem 0;
  }
}

.container {
  padding: 0 1rem;
}

dl {
  & > div:not(:nth-child(3)) {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  & > div:nth-child(3) {
    border-bottom: 1px solid #d7d7d7;
    padding-bottom: 1rem;
  }
}

caption {
  font-size: 1.2rem;
  color: #454545;
  text-align: left;
}

table {
  border: 1px solid #d7d7d7;
  border-collapse: collapse;
  text-align: left;
  font-size: 1.4rem;
  width: 80rem;

  tr {
    border: 1px solid #d7d7d7;
  }

  th {
    font-weight: $semibold-weight;
    text-transform: uppercase;
  }

  td, th {
    padding: 0.75rem;
  }
}

dd > span {
  font-weight: $semibold-weight !important;
}

</style>
