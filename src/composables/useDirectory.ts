import { useAssociationStore } from '@/stores/useAssociationStore'

export default function () {
  const associationStore = useAssociationStore()

  async function getAssociationDetail(routeParams: string) {
    if (routeParams) {
      const id = parseInt(routeParams)
      await associationStore.getAssociationDetail(id)
    }
  }

  return {
    getAssociationDetail,
  }
}
