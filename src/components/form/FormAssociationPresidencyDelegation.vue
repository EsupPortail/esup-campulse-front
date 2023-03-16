<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {defineProps, ref, watch} from 'vue'
import type {AssociationUser, UserAssociationPatch} from '#/user'
import {useRoute} from "vue-router";
import AlertConfirmAssociationPresidentDelegation
    from "@/components/alert/AlertConfirmAssociationPresidentDelegation.vue";
import {useQuasar} from "quasar";

const route = useRoute()
const {notify} = useQuasar()

const {t} = useI18n()
const hasChanged = ref(false)


const props = defineProps({
    associationUser: {
        type: Object as () => AssociationUser,
        required: true,
    },
})

const associationUser = ref(props.associationUser)

// create a deep copy of props.associationUser
let initialAssociationUser = JSON.parse(JSON.stringify(props.associationUser))


function isEqual(_associationUser: AssociationUser, _initialAssociationUser: AssociationUser): boolean {
    //don't show button of Alert if initial canBeUser was false & user click twice the activate/desactivate delegation button even if any date input changed
    if (!_initialAssociationUser.canBePresident && !_associationUser.canBePresident) {
        return true;
    }
    return JSON.stringify(_associationUser) === JSON.stringify(_initialAssociationUser);
}

watch(() => associationUser, () => {
    const equal = isEqual(associationUser.value, initialAssociationUser)
    if (equal) {
        hasChanged.value = false
    } else {
        hasChanged.value = true
    }

    //in case there is some change, notify user he has to validate it to save it in db
    if (hasChanged.value === true) {
        notify({
            message: t('notifications.announcement.save-delegation-change'),
            icon: 'mdi-warning'
        })
    }
}, {deep: true})

const hasValidated = function (infoPatched: UserAssociationPatch) {
    hasChanged.value = false;
    console.log('hasValidated', infoPatched)
    associationUser.value.canBePresident = infoPatched.canBePresident || false
    associationUser.value.canBePresidentFrom = infoPatched.canBePresidentFrom
    associationUser.value.canBePresidentTo = infoPatched.canBePresidentTo
    initialAssociationUser = JSON.parse(JSON.stringify(props.associationUser))
}

</script>


<template>
    <QForm ref="associationEditPresidentDelegation"
           class="q-gutter-md"
    >
        <div class="row">
            <!-- /!\warning regarding 'Instance member is not accessible' should be safely ignored here -->
            <QBtn
                :color="associationUser.canBePresident ? 'blue': 'red'"
                :label="t(associationUser.canBePresident ? 'association.disable-president-delegation' : 'association.enable-president-delegation')"
                @click="associationUser.canBePresident= !associationUser.canBePresident"></QBtn>
            <QSpace/>
            <AlertConfirmAssociationPresidentDelegation
                v-if="hasChanged"
                :associationUser="associationUser"
                @has-validated="hasValidated"
            />
        </div>
        <div class="row">
            <QInput v-if="associationUser.canBePresident" v-model="associationUser.canBePresidentFrom"
                    :hint="t('association.delegate-president-role-from')"
                    filled
                    type="date">
                <template>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
            <QSpace/>
            <QInput v-if="associationUser.canBePresident && associationUser.canBePresidentFrom"
                    v-model="associationUser.canBePresidentTo"
                    :hint="t('association.delegate-president-role-to')"
                    filled
                    type="date">
                <template>
                    <QIcon name="mdi-calendar"/>
                </template>
            </QInput>
            <QSpace/>
        </div>
    </QForm>
</template>