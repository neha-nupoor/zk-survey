import { hasIdentityCreated } from "../utils/storage"

export const isLoggedIn = () => {
    // return false
    return hasIdentityCreated()
}