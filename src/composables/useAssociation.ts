import _axios from "@/plugins/axios";
import {useAssociationStore} from "@/stores/useAssociationStore";


export default function () {
    const associationStore = useAssociationStore()

    async function createAssociation(name: string) {
        await _axios.post('/associations/', {name: name})
    }

    async function deleteAssociation() {
        await _axios.delete(`/associations/${associationStore.association?.id}`)
    }

    return {createAssociation, deleteAssociation}
}