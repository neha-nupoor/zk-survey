import { providers, Contract, ethers } from "ethers"
import config from "../artifacts/config.json"
import semaphoreArtifact from "../artifacts/contracts/Semaphore.json"
import { storeId } from "../utility/storage"
import constants from "../utility/constants"
import {
    vote,
    createPoll,
    genIdentity,
    genExternalNullifier,
    genSignalHash
} from "./apiCalls"

let semaphoreContract

const { localStorage } = window

export async function connectContract() {
    const { ethereum } = window
    const accounts = await ethereum.request({ method: "eth_accounts" })

    if (accounts.length !== 0) {
        const provider = new providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        console.log("signer: ", await signer.getAddress())

        semaphoreContract = new Contract(
            config.chain.contracts.Semaphore,
            semaphoreArtifact.abi,
            signer
        )
    }
}

export async function registerIdentity() {
    // generate identity commitment, trapdoor and nullifier from backend.
    // can be done in FE too.
    const response = await genIdentity()
    const identity = response.data.data
    console.log(identity)
    const identityCommitment = identity.identityCommitment

    console.log("Identity Commitment: ", identityCommitment)
    // insert the IC in the merkle tree
    const tx = await semaphoreContract.insertIdentity(identityCommitment)
    const receipt = await tx.wait()
    console.log(receipt)
    if (receipt.status === 1) {
        // if the ic is saved successfully, store nullifier, and trapdoor in localStorage
        storeId(identity, identityCommitment)
        return true
    }
    return false
}

export async function getIdentityCommitments() {
    const idCommitments = await semaphoreContract
        .getIdentityCommitments()
        .catch((error) => {
            console.log(error)
        })
    const identityCommitments = []
    // eslint-disable-next-line prefer-const
    for (let idc of idCommitments) {
        identityCommitments.push(idc.toString())
    }
    return identityCommitments
}

export async function packProof(solidityProof) {
    const packedProof = await semaphoreContract
        .packProof(solidityProof.a, solidityProof.b, solidityProof.c)
        .catch((err) => console.log(err))
    return packedProof
}

export async function broadcastSignal(
    signal,
    packedProof,
    root,
    nullifierHash,
    externalNullifier
) {
    try {
        const tx = await semaphoreContract
            .broadcastSignal(
                ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal)),
                packedProof,
                root,
                nullifierHash,
                externalNullifier
            )
            .catch(() => {
                return false
            })
        const receipt = await tx.wait()
        console.log(receipt)
        if (receipt.status === 1) {
            return true
        }
        return false
    } catch {
        return false
    }
}

export async function addPoll(poll) {
    try {
        const title = poll.title.replace(/\s+/g, "")
        const genExternalNullifierReq = {}
        genExternalNullifierReq.title = title
        // get external nullifier from backend, based on poll title [ what happens for same title? ]
        const response = await genExternalNullifier(genExternalNullifierReq)
        const titleHash = response.data.data

        // add external nullifier in contract.
        // if same external nullifier exists in contract, it fails.
        const tx = await semaphoreContract
            .addExternalNullifier(titleHash)
            .catch((err) => console.log(err))
        const receipt = await tx.wait()

        console.log(receipt)
        // if receipt status 1, 
        // first generate a signal hash out of all options
        // then create poll with those signals
        if (receipt.status === 1) {
            const request = poll
            request.hash = titleHash // poll's hash is external nullifier
            request.owner = localStorage.getItem("wallet_address")

            // for each answer generate a signal hash.
            const surveyOptions = constants.poll_options
            console.log(surveyOptions)
            for (let index = 0; index < surveyOptions; index++) {
                const signal = `0x0${index}`
                request.options[index].signal = signal

                const signalRequest = {}
                signalRequest.signal = signal
                const response = await genSignalHash(signalRequest)
                const signalHash = response.data.data
                request.options[index].hash = signalHash
            }
            console.log(request)
            // if this is successful, [TODO-Neha: Add try/catch] create the poll
            createPoll(request)
            return true
        } else {
            // TODO-Neha: Show error
            return false
        }
    } catch {
        return false
    }
}

export async function voteOption(options, voteAnswer, pollId, newVotes) {
    const pollAnswer = options.map((answer) => {
        if (answer.option === voteAnswer) {
            answer.votes = newVotes
        }
        return answer
    })

    const request = { options: pollAnswer }

    return vote(pollId, request).then((poll) => {
        return poll
    })
}
