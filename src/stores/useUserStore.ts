import {defineStore} from 'pinia'
import type {CasLogin, LocalLogin, User, UserStore} from '#/user'
import useSecurity from '@/composables/useSecurity'
import {useAxios} from '@/composables/useAxios'
import useUserGroups from '@/composables/useUserGroups'
import type {DocumentProcessType, DocumentUpload} from '#/documents'
import useCommissions from '@/composables/useCommissions'

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        userAssociations: [],
        userDocuments: []
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
        userFunds: (state: UserStore): (number | null | undefined)[] | undefined => {
            const {funds} = useCommissions()
            const fundsArray: number[] = []
            state.user?.groups.forEach(group => {
                if (group.institutionId) {
                    const foundFunds = funds.value.filter(fund => fund.institution === group.institutionId)
                    foundFunds?.forEach((fund) => {
                        fundsArray.push(fund.id)
                    })
                }
            })
            return fundsArray
        },
        isAssociationMember: (state: UserStore): boolean => {
            return !!state.user?.associations?.length
        }
    },
    actions: {
        /**
         * It takes an url and a data object, and then it makes a post request to the url with the data object
         * @param {string} url - The url to send the request to.
         * @param {LocalLogin | CasLogin} data - LocalLogin | CasLogin
         */
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const {axiosPublic} = useAxios()
            const {newUser, setTokens} = useSecurity()
            const response = await axiosPublic.post(url, data)
            const {access, refresh, user} = response.data as { access: string, refresh: string, user: User }
            // User account is complete
            if (user.groups.length) {
                // If user is validated by admin
                if (user.isValidatedByAdmin) {
                    setTokens(access, refresh)
                    this.user = user
                }
                // If user is not validated by admin
                else {
                    throw new Error('USER_NOT_VALIDATED_BY_ADMIN')
                }
            }
            // User account is not complete
            else {
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
            const {access, refresh, user} = data
            // If the user has already created an account
            if (user.groups.length) {
                throw new Error('USER_ACCOUNT_ALREADY_EXISTS')
            }
            // If the user has no account
            else {
                const {setTokens} = useSecurity()
                setTokens(access, refresh)
                this.newUser = user
            }
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
        },

        async getUserDocuments(processTypes?: DocumentProcessType[]) {
            const {axiosAuthenticated} = useAxios()
            let url = `/documents/uploads?user_id=${this.user?.id}`
            if (processTypes?.length) {
                url += `&process_types=${processTypes.join(',')}`
            }
            this.userDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
        }
    }
})
