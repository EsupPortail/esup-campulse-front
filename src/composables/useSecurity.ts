import {ref} from "vue";
import type {UserLogin} from "#/user";
import {useUserStore} from "@/stores/useUserStore";

export default function () {
    const user = ref<UserLogin>({
        username: '',
        password: ''
    })

    const userStore = useUserStore()

    async function logIn() {
        await userStore.logIn('/users/auth/login/', {
            username: user.value.username,
            password: user.value.password as string
        })
    }

    return {logIn, user}
}