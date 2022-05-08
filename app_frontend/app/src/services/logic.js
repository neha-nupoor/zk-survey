import { providers, Contract, ethers } from "ethers"
import config from "../artifacts_mainnet/config.json"
import semaphoreArtifact from "../artifacts_mainnet/contracts/Semaphore.json"
import { storeId } from "../utils/storage"
import constants from "../constants/constants"
import {
    vote,
    createPoll,
    genIdentity,
    genExternalNullifier,
    genSignalHash,
    getSurveys
} from "./apiCalls"
import { calculateNPSDetractors, calculateNPSPassives, calculateNPSPromoters, calculateNPSScore } from "src/utils/nps"
import { expiryDateLabels } from "../utils/misc"

let semaphoreContract

let localStorage = null;
if (typeof window !== "undefined") {
    localStorage = window.localStorage
}

export async function connectSemaphoreContract() {
    if (window.semaphoreContract !== undefined) {
        console.log("---contract defined-----")
        return;
    }
    const { ethereum } = window
    const accounts = await ethereum.request({ method: "eth_accounts" })

    if (accounts.length !== 0) {
        const provider = new providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        // console.log("signer: ", await signer.getAddress())
        semaphoreContract = new Contract(
            config.chain.contracts.Semaphore,
            semaphoreArtifact.abi,
            signer
        )
        window.semaphoreContract = semaphoreContract;
        window.signer = signer;
        console.log("-----2-----")
        return await signer.getAddress()
    } else {
        // TODO: Implement better alert
        return false
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
    if (!semaphoreContract) {
        await connectSemaphoreContract()
    }

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
            .catch((err) => {
                console.log(err)
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

export async function addSurvey(poll) {
    try {
        const title = poll.title.replace(/\s+/g, "")
        const genExternalNullifierReq = {}
        genExternalNullifierReq.title = title
        // get external nullifier from backend, based on poll title [ what happens for same title? ]
        const response = await genExternalNullifier(genExternalNullifierReq)
        const titleHash = response.data.data
        console.log("========here====");
        console.log(constants)
        // add external nullifier in contract.
        // if same external nullifier exists in contract, it fails.
        const tx = await semaphoreContract
            .addExternalNullifier(titleHash)
            .catch((err) => console.log(err))
        const receipt = await tx.wait()
        console.log("---receipt of added nullifier----", receipt)
        console.log(semaphoreContract)

        const hasNullifierActive = await semaphoreContract.isExternalNullifierActive(titleHash).catch(err => console.log(err));
        console.log(hasNullifierActive);

        console.log("---sent external nullifier----", titleHash)
        
        // if receipt status 1, 
        // first generate a signal hash out of all options
        // then create poll with those signals
        if (receipt.status === 1) {
            const request = poll
            request.hash = titleHash // poll's hash is external nullifier
            request.owner = localStorage.getItem("wallet_address")

            // for each answer generate a signal hash.
            const surveyOptions = constants.poll_options
            // console.log(surveyOptions)
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
    } catch (err) {
        console.log("===here===", err)
        return false
    }
}

export async function voteOption(options, voteAnswer, pollId, newVotes) {
    const pollAnswer = options.map((answer) => {
        if (answer.signal === voteAnswer) {
            answer.votes = newVotes
        }
        return answer
    })

    const request = { options: pollAnswer }
    return vote(pollId, request).then((poll) => {
        return poll
    })
}

export async function getAllSurveys() {
    return getSurveys().then((polls) => {
        return polls.data.data.map(poll => {
            poll.npsScore = calculateNPSScore(poll)
            poll.npsPromoters = calculateNPSPromoters(poll)
            poll.npsDetractors = calculateNPSDetractors(poll)
            poll.npsPassives = calculateNPSPassives(poll)
            poll.expiryLabel = expiryDateLabels(poll.expiry)
            return poll 
        })
    })
}
