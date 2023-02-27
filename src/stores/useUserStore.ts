import {defineStore} from 'pinia'
import type {CasLogin, LocalLogin, User, UserStore} from '#/user'
import useSecurity from '@/composables/useSecurity'
import {useAxios} from '@/composables/useAxios'

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        userAssociations: []
    }),

    getters: {
        isAuth: (state: UserStore): boolean => !!state.user,
        isCas: (state: UserStore): boolean | undefined => state.user?.isCas || state.newUser?.isCas,
        // To test ? Should we keep it ?
        userName: (state: UserStore): string | undefined => {
            return state.user?.firstName + ' ' + state.user?.lastName
        },
        userInstitutions: (state: UserStore): (number | undefined)[] | undefined => {
            return state.user?.groups.map(group => (
                group.institutionId
            ))
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
        // Should we pass it to axiosPublic instance ?
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.post(url, data)
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
            removeTokens()
            this.unLoadUser()
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
        async getUserAssociations() {
            if (this.user && this.user.associations.length > 0) {
                const {axiosAuthenticated} = useAxios()
                this.userAssociations = (await axiosAuthenticated.get('/users/associations/')).data
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
            const {axiosAuthenticated} = useAxios()
            const data = (await axiosAuthenticated.post('/users/auth/cas/login/', {ticket, service})).data
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
                const association = this.userAssociations.find(obj => obj.association === associationId)
                if (association?.isPresident || association?.canBePresident) perm = true

            }
            return perm
        }
    }
})

