import {defineStore} from 'pinia'
import type {CasLogin, LocalLogin, User, UserStore} from '#/user'
import useSecurity from '@/composables/useSecurity'
import {useAxios} from '@/composables/useAxios'
import useUserGroups from '@/composables/useUserGroups'

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        userAssociations: []
    }),

    getters: {
        isAuth: (state: UserStore): boolean => !!state.user,
        isCas: (state: UserStore): boolean | undefined => state.user?.isCas || state.newUser?.isCas,
        userInstitutions: (state: UserStore): (number | null | undefined)[] | undefined => {
            const institutionsArray: number[] = []
            state.user?.groups?.forEach((group) => {
                if (group.institutionId) {
                    institutionsArray.push(group.institutionId)
                }
            })
            return institutionsArray
        },
        isAssociationMember: (state: UserStore): boolean => {
            return !!state.user?.associations?.length
        }
    },
    actions: {
        /**
         * It takes a url and a data object, and then it makes a post request to the url with the data object
         * @param {string} url - The url to send the request to.
         * @param {LocalLogin | CasLogin} data - LocalLogin | CasLogin
         */
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const {axiosPublic} = useAxios()
            const response = await axiosPublic.post(url, data)
            const {accessToken, refreshToken, user} = response.data
            if (user.isValidatedByAdmin) {
                const {setTokens} = useSecurity()
                setTokens(accessToken, refreshToken)
                this.user = user
            } else {
                throw new Error
            }
        },
        async logOut() {
            const {removeTokens} = useSecurity()
            const {isStaff} = useUserGroups()
            removeTokens()
            this.unLoadUser()
            isStaff.value = undefined
        },
        /**
         * It gets the user data from the server, and if the user is validated by the admin, it sets the user data to the
         * user variable, and if the user is not validated by the admin, it sets the user data to the newUser variable
         */
        async getUser() {
            const {axiosAuthenticated} = useAxios()
            const user = (await axiosAuthenticated.get<User>('/users/auth/user/')).data
            if (user.isValidatedByAdmin) {
                this.user = user
            } else {
                // Specific case for CAS user data which can persist until complete registration
                if (user.isCas) {
                    this.newUser = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isCas: true,
                        username: user.username,
                        email: user.email,
                        phone: user.phone as string
                    }
                } else {
                    await this.logOut()
                }
            }
        },
        /*async getUserAssociations() {
            if (this.user && this.user.associations.length > 0) {
                const {axiosAuthenticated} = useAxios()
                const userAssociations = (await axiosAuthenticated.get('/users/associations/')).data
                for (const index in userAssociations) {
                    const temp = {
                        id: userAssociations[index].association,
                        name: '',
                        isSite: undefined,
                        institution: undefined,
                        isEnabled: undefined,
                        isPublic: undefined,
                    }
                    if (userAssociations[index].isValidatedByAdmin) {
                        const association = (await axiosAuthenticated.get(`/associations/${userAssociations[index].association}`)).data
                        temp.name = association.name
                        temp.isSite = association.isSite
                        temp.institution = association.institution
                        temp.isEnabled = association.isEnabled
                        temp.isPublic = association.isPublic
                    } else {
                        const associationStore = useAssociationStore()
                        await associationStore.getAssociationNames(false, false)
                        const association = associationStore.associationNames.find(obj => obj.id === userAssociations[index].association)
                        if (association) {
                            temp.name = association.name
                        }
                    }
                }
                this.userAssociations = userAssociations
            }
        },*/
        unLoadUser() {
            this.user = undefined
            this.userAssociations = []
        },
        unLoadNewUser() {
            const {removeTokens} = useSecurity()
            removeTokens()
            this.newUser = undefined
        },
        /**
         * It sends a POST request to the backend with the CAS ticket and the service URL, and then it sets the tokens and
         * the user
         * @param {string} ticket - the ticket returned by CAS
         */
        async loadCASUser(ticket: string) {
            const service = import.meta.env.VITE_APP_FRONT_URL + '/cas-register'
            const {axiosPublic} = useAxios()
            const data = (await axiosPublic.post('/users/auth/cas/login/', {ticket, service})).data
            const {accessToken, refreshToken, user} = data
            const {setTokens} = useSecurity()
            setTokens(accessToken, refreshToken)
            this.newUser = user
        },

        /**
         * It checks if the user is president of the association.
         * @param {number} associationId - number - The id of the association you want to check
         * @returns A boolean value.
         */
        hasPresidentStatus(associationId: number): boolean {
            let perm = false
            if (this.userAssociations.length && associationId) {
                const association = this.userAssociations.find(obj => obj.association.id === associationId)
                if (association?.isPresident) {
                    perm = true
                } else if ((association?.canBePresidentFrom) || (association?.canBePresidentTo)) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    let canBePresidentFrom = today
                    if (association?.canBePresidentFrom) {
                        canBePresidentFrom = new Date(association?.canBePresidentFrom)
                        canBePresidentFrom.setHours(0, 0, 0, 0)
                    }
                    let canBePresidentTo = today
                    if (association?.canBePresidentTo) {
                        canBePresidentTo = new Date(association?.canBePresidentTo)
                        canBePresidentTo.setHours(0, 0, 0, 0)
                    }
                    if ((canBePresidentFrom <= today) && (canBePresidentTo >= today)) {
                        perm = true
                    }
                }
            }
            return perm
        }
    }
})
