import type { UserAssociations, UserRegister } from "#/user";
import _axios from "@/plugins/axios";

// Tokens
function setTokens(access: string, refresh: string) {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
}

function removeTokens() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
}

// Set bearer
function setBearer() {
    const access = localStorage.getItem('access')
    _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
}

// Register functions
async function userLocalRegister(newUser: UserRegister) {
    await _axios.post('/users/auth/registration/', newUser)
}

async function userCASRegister(newUserInfo: string | null) {
    setBearer()
    await _axios.patch('/users/auth/user/', { phone: newUserInfo })
}

async function userAssociationsRegister(username: string, newUserAssociations: UserAssociations) {
    for (let i = 0; i < newUserAssociations.length; i++) {
        await _axios.post('/users/association/', {
            user: username,
            association: newUserAssociations[i].id,
            has_office_status: newUserAssociations[i].has_office_status
        })
    }
}


export {
    userAssociationsRegister,
    userCASRegister,
    userLocalRegister,
    setTokens,
    removeTokens,
    //
}
