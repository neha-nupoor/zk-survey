import { Fragment, useState, useEffect } from "react"

import {
    Alert,
    Card,
    Container,
    CardImg,
    CardBody,
    Row,
    Col,
    CardTitle,
    CardText,
    Modal,
    Input,
    Label,
    Button,
    ModalBody,
    ModalHeader,
    FormFeedback
} from "reactstrap"
import Poll from "react-polls"

// ** Custom Components
import Breadcrumbs from "../utility/breadcrumbs"

import { generateMerkleProof, genNullifierHash, getPolls } from "../services/apiCalls"

// import img1 from "@src/assets/images/slider/06.jpg"
import CreatePoll from "./CreatePoll"
import {
    getIdentityCommitments,
    connectContract,
    packProof,
    broadcastSignal,
    voteOption
} from "../services/logic"
import { handleError, handleLoading, handleSuccess } from "../utility/alert"
import { retrieveId, hasIdentityCreated } from "../utility/storage"
import { calculateNPSScore, calculateNPSDetractors, calculateNPSPassives, calculateNPSPromoters, getTotalVotesCount } from "@utils/nps-calc/nps"

const Home = () => {
    // ** States
    const [data, setData] = useState([])
    const [ownerSurvey, setOwnerSurvey] = useState([])
    const [responderSurvey, setResponderSurvey] = useState([])
    const [show, setShow] = useState(false)
    const getSignerAddress = connectContract()


    const ZERO_VALUE = "56568702409114342732388388764660722017601642515166106701650971766248247995328"

    const getNewPolls = () => {
        getSignerAddress.then(addr => {
            const ownerData = []
            const responderData = []
            getPolls().then((polls) => {
                setData(polls.data.data)
                if (polls.owner === addr) {
                    ownerData.push(polls.data.data)
                } else {
                    responderData.push(polls.data.data)
                }
            })
            setOwnerSurvey(ownerData)
            setResponderSurvey(responderData)
        })
       
    }
    useEffect(() => {
        getNewPolls()
    }, [])

    
    // Handling user vote
    const handleVote = async (voteAnswer, options, pollHash, pollId) => {
        const hasIdentity = hasIdentityCreated()
        if (!hasIdentity) {
            handleError('No Identity added', 'Please add identity to vote')
            return
        }

        const pollAnswer = options.find(
            (answer) => answer.option === voteAnswer
        )
        const newVotes = pollAnswer.votes + 1
        handleLoading()
        const signal = pollAnswer.signal
        const externalNullifier = pollHash
        const identityCommitments = await getIdentityCommitments() // get all id-commitments from the semaphore contract.
        const identity = retrieveId() // get the IC, trapdoor and nullifier.
        const treeDepth = 20
        const identityCommitment = identity.identityCommitment

        const genNullifierHashReq = {}
        genNullifierHashReq.externalNullifier = externalNullifier
        genNullifierHashReq.identityNullifier = identity.identityNullifier
        genNullifierHashReq.treeDepth = treeDepth

        // get nullifier hash from backend using the protocol library
        const genNullifierHashResponse = await genNullifierHash(genNullifierHashReq) 
        const nullifierHash = genNullifierHashResponse.data.data

        const serializedIdentity = {
            identityNullifier: identity.identityNullifier,
            identityTrapdoor: identity.identityTrapdoor
        }

        const genProofReq = {}
        genProofReq.treeDepth = treeDepth
        genProofReq.zeroValue = ZERO_VALUE
        genProofReq.identityCommitments = identityCommitments
        genProofReq.identityCommitment = identityCommitment
        genProofReq.serializedIdentity = serializedIdentity
        genProofReq.externalNullifier = externalNullifier
        genProofReq.signal = signal // poll answer is the signal [ so you broadcast one signal only once ]

        console.log(genProofReq)
        const genProofResponse = await generateMerkleProof(genProofReq) // generate the Merkle proof.
        const solidityProof = genProofResponse.data.data.solidityProof
        const root = genProofResponse.data.data.root

        const packedProof = await packProof(solidityProof)

        const intProofs = []
        let intProof
        packedProof.map((proof) => {
            intProof = BigInt(proof)
            intProofs.push(intProof)
            return intProofs
        })
       
        const isValidBroadcast = await broadcastSignal(
            signal,
            intProofs,
            root,
            nullifierHash,
            externalNullifier
        )

        if (isValidBroadcast) {
            const res = await voteOption(options, voteAnswer, pollId, newVotes)
            console.log("===", res)
            if (res.status === 200) {
                getPolls().then((polls) => {
                    setData(polls.data.data)
                })
            }
            handleSuccess()
        } else {
            handleError()
        }
    }

   
    const renderPolls = () => {
        if (data.length) {
            return data.map((poll) => {
                // console.log(ownerSurvey, responderSurvey)
                const npsScore = calculateNPSScore(poll)
                return (
                    <Col key={poll._id}>
                        <Card className='mb-3'>
                            <CardBody>
                                <CardTitle tag='h4'>{poll.title} - {`${getTotalVotesCount(poll)} votes`}</CardTitle>
                                <Card>
                                    <CardText>{poll.description}</CardText>
                                    <CardText tag='h5'> {`NPS Score: ${npsScore} %`} </CardText>
                                    <CardText> Promoter NPS Score: {calculateNPSPromoters(poll)} %</CardText>
                                    <CardText> Detractor NPS Score: {calculateNPSDetractors(poll)} %</CardText>
                                    <CardText> Passive NPS Score: { calculateNPSPassives(poll) } %</CardText>
                                    <CardText>
                                        <small className='text-muted'>
                                            {`Expires: ${poll.expiry}`}
                                        </small>
                                    </CardText>
                                </Card>
                                
                                {/* TODO: Show the polls only when identity is generated */}
                                <Poll
                                    question={poll._id}
                                    answers={poll.options}
                                    onVote={(voteAnswer) => handleVote(
                                            voteAnswer,
                                            poll.options,
                                            poll.hash,
                                            poll._id
                                        )
                                    }
                                    customStyles={{ theme: "cyan", align: "left" }}
                                    noStorage={true}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                )
            })
        }
    }

    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='Zero Knowledge based NPS Calculator'
                breadCrumbParent='Surveys'
                setShow={setShow}
            />
             <Row md='10' sm='10' xs='10' className='logInPrompt'>
             {
                !hasIdentityCreated() ?  <Row md='8' xs ='1' sm='8' lg='8' tag='div'><Alert color="warning">
                    <p>You are not logged in anonymously yet. Please click on Add Identity button if you want to take survey.</p>
                </Alert></Row> : null
            }
             </Row>
            
            <Row md='3' sm='2' xs='1'>
                {" "}
                {renderPolls()}
            </Row>
            <Modal
                isOpen={show}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader
                    className='bg-transparent'
                    toggle={() => setShow(!show)}
                ></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Add a New Survey</h1>
                    </div>
                    <CreatePoll setShow={setShow} getNewPollList={getNewPolls} />
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default Home
