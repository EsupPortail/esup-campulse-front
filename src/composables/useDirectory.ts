import {useAssociationStore} from '@/stores/useAssociationStore'

const associationStore = useAssociationStore()

export default function () {

    async function getAssociationDetail(routeParams: string) {
        if (routeParams) {
            const id = parseInt(routeParams)
            await associationStore.getAssociationDetail(id)
        }
    }

    return {getAssociationDetail}
}