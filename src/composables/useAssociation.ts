import _axios from "@/plugins/axios";
import {ref} from "vue";
import type {UserAssociations} from "#/user";

const newAssociations = ref<UserAssociations>([])

export default function () {
    async function createAssociation(name: string) {
        await _axios.post('/associations/', {name: name})
    }

    // Add or remove new multiple associations
    function addAssociation() {
        newAssociations.value.push({
            id: null,
            hasOfficeStatus: false
        })
    }

    function removeAssociation(index: number) {
        newAssociations.value.splice(index, 1)
    }


    return {createAssociation, newAssociations, addAssociation, removeAssociation}
}