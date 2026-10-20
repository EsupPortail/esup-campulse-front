import {defineStore} from 'pinia'
import type {CasLogin, LocalLogin, ProfileStore, User} from '#/user'
import useSecurity from '@/composables/useAuthentication'
import {useAxios} from '@/composables/useAxios'
import type {DocumentProcessType} from '#/document'
import * as profileService from '@/services/ProfileService'
import * as userService from '@/services/UserService'
import * as documentUploadService from '@/services/DocumentUploadService'

export const useProfileStore = defineStore('profileStore', {
  state: (): ProfileStore => ({
    user: undefined,
    newUser: undefined,
    userAssociations: [],
    userDocuments: []
  }),

  getters: {
    isAuth: (state: ProfileStore): boolean => !!state.user,
    isCas: (state: ProfileStore): boolean => state.user?.isCas || state.newUser?.isCas || false,
    isAssociationMember: (state: ProfileStore): boolean => {
      return !!state.user?.associations?.length
    },
    userGroups: (state: ProfileStore): number[] => {
      return [...new Set(state.user?.groups?.map<number>(group => group.groupId))]
    },
  },

  actions: {
    async logIn(url: string, data: LocalLogin | CasLogin) {
      const {axiosPublic} = useAxios()
      const {newUser, setTokens} = useSecurity()
      const response = await axiosPublic.post(url, data)
      const {access, refresh, user} = response.data as { access: string, refresh: string, user: User }
      const hasGroups = !!user.groups.length
      if (hasGroups) {
        if (user.isValidatedByAdmin) {
          setTokens(access, refresh)
          this.user = user
        } else {
          throw new Error('USER_NOT_VALIDATED_BY_ADMIN')
        }
      } else {
        setTokens(access, refresh)
        newUser.isCas = user.isCas
        newUser.email = user.email
        newUser.username = user.username
        newUser.firstName = user.firstName
        newUser.lastName = user.lastName
        newUser.phone = user.phone
        throw new Error('USER_ACCOUNT_NOT_COMPLETE')
      }
    },
    logOut() {
      const {removeTokens} = useSecurity()
      removeTokens()
      this.unloadProfile()
    },
    // old = getUser
    async getProfile() {
      const user = await profileService.getProfile()
      if (user.isValidatedByAdmin) {
        this.user = user
      } else if (user.isCas) {
        this.newUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          isCas: true,
          username: user.username,
          email: user.email,
          phone: user.phone as string
        }
      } else {
        this.logOut()
      }
    },
    // old = unLoadUser
    unloadProfile() {
      this.user = undefined
      this.userAssociations = []
    },
    // old = unLoadNewUser
    unloadNewProfile() {
      const {removeTokens} = useSecurity()
      removeTokens()
      this.newUser = undefined
    },
    // old = loadCASUser
    async loadCASProfile(ticket: string) {
      const service = import.meta.env.VITE_APP_FRONT_URL + '/cas-register'
      const data = await profileService.loadCASProfile(ticket, service)
      const {access, refresh, user} = data
      const hasGroups = !!user.groups.length
      if (hasGroups) {
        throw new Error('USER_ACCOUNT_ALREADY_EXISTS')
      } else {
        const {setTokens} = useSecurity()
        setTokens(access, refresh)
        this.newUser = user
      }
    },
    async getUserAssociations() {
      this.userAssociations = await userService.getUserAssociations(this.user.id)
    },
    hasPresidentStatus(associationId: number): boolean {
      if (!this.userAssociations.length || !associationId) return false
      const association = this.userAssociations
        .find(item => item.association.id === associationId)
      if (!association) return false
      if (association.isPresident) {
        return true
      } else if (association.canBePresidentFrom || association.canBePresidentTo) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        let canBePresidentFrom = today
        if (association.canBePresidentFrom) {
          canBePresidentFrom = new Date(association.canBePresidentFrom)
          canBePresidentFrom.setHours(0, 0, 0, 0)
        }
        let canBePresidentTo = today
        if (association.canBePresidentTo) {
          canBePresidentTo = new Date(association.canBePresidentTo)
          canBePresidentTo.setHours(0, 0, 0, 0)
        }
        if ((canBePresidentFrom <= today) && (canBePresidentTo >= today)) {
          return true
        }
      } else {
        return false
      }
    },
    async getUserDocuments(processTypes?: DocumentProcessType[]) {
      this.userDocuments = await documentUploadService.getUserDocumentUploads(this.user.id, processTypes)
    }
  }
})
