let localStorage = null;
if (typeof window !== "undefined") { 
    localStorage = window.localStorage
}


// The storage key depends on the mixer contracts to prevent conflicts
const postfix = 'identity_commitment'
const key = `SU_${postfix}`

const initStorage = () => {
  if (!localStorage || !localStorage.getItem(key)) {
    localStorage.setItem(key, '')
  }
}

const storeId = (identity, identityCommitment) => {
    if (localStorage != null) {
        localStorage.setItem(key, identityCommitment)
        localStorage.setItem('SU_identity_nullifier', identity.identityNullifier)
        localStorage.setItem('SU_identity_trapdoor', identity.identityTrapdoor)
    } else {
        console.warn("local storage not defined")
    }
  
}

const retrieveId = () => {
    if (localStorage != null) { 
        const identityCommitment = localStorage.getItem(key)
        const identityNullifier = localStorage.getItem('SU_identity_nullifier')
        const identityTrapdoor = localStorage.getItem('SU_identity_trapdoor')
        return { identityCommitment, identityNullifier, identityTrapdoor }
    } else {
        console.warn("local storage not defined")
    }
}

const hasId = () => {
    if (localStorage != null) { 
        const d = localStorage.getItem(key)
        return d !== null && d.length > 0
    } else {
        console.warn("local storage not defined")
    }

}

const storeWallet = (wallet) => {
    if (localStorage != null) { 
        localStorage.setItem('wallet_address', wallet)
    } else {
        console.warn("local storage not defined") 
    }
        
}

const hasIdentityCreated = () => {
    if (localStorage != null) {
        const {identityCommitment, identityNullifier, identityTrapdoor } = retrieveId()
        //   console.log("=====", identityCommitment, identityNullifier, identityTrapdoor)
        if (identityCommitment !== null && identityNullifier !== null && identityTrapdoor !== null) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
  
}

export { initStorage, storeId, retrieveId, hasId, storeWallet, hasIdentityCreated }