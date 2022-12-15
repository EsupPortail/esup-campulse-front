import _axios from "@/plugins/axios";

export default function () {
    async function createAssociation(name: string) {
        await _axios.post('/associations/', {name: name})
    }

    return {createAssociation}
}