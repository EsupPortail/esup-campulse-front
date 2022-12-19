<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {useUserManagerStore} from "@/stores/useUserManagerStore";
import {useQuasar} from "quasar";

const {t} = useI18n()
const confirm = ref<boolean>(false)
const userManagerStore = useUserManagerStore()
const {notify} = useQuasar()

async function onDeleteUser() {
  try {
    await userManagerStore.deleteUser()
    await router.push({name: 'ManageUsers'})
    notify({
      type: 'positive',
      message: t('notifications.positive.validate-delete-user')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.unknown-user')
    })
  }
}
</script>

<template>
  <QBtn :label="t('user-manager.delete')" color="red" icon="mdi-delete" @click="confirm = true"/>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ t("user-manager.confirm-delete") }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup color="primary" flat label="Annuler"/>
        <q-btn v-close-popup color="red" flat label="Supprimer" @click="onDeleteUser"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>