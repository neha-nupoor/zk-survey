import { useState } from 'react';
import { format } from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';

import { SeverityPill } from '../severity-pill';
import RespondNPSSurveyComponent from "./respond-survey";

import { generateMerkleProof, genNullifierHash } from "src/services/apiCalls";
import {
    getIdentityCommitments,
    packProof,
    broadcastSignal,
    voteOption
} from "src/services/logic"
import { handleError, handleLoading, handleSuccess } from "src/components/alert/alert"
import { retrieveId, hasIdentityCreated } from "src/utils/storage"
import constants  from "src/constants/constants";


export const RespondersSurvey = (props) => {
  const {surveys, signeraddress} = props
  const filteredSurveys = surveys.filter(survey => {
    if (survey.owner !== null && signeraddress !== null) {
      return survey.owner.toLowerCase() !== signeraddress.toLowerCase() 
    }
  })



  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedSurvey, setSelectedSurvey] = useState({});

  const handleClickOpenDialog = (survey) => {
    setSelectedSurvey(survey);
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  const handleVote = async (voteAnswer, options, pollHash, pollId, survey) => {
    // Handling user vote
     const hasIdentity = hasIdentityCreated()
     if (!hasIdentity) {
         handleError('No Identity added', 'Please add identity to vote')
         return
     }

     const pollAnswer = options.find(
         (answer) => answer.signal === voteAnswer
     )
     
     const newVotes = pollAnswer.votes + 1
    //  console.log(pollAnswer, newVotes, constants.treeDepth, constants.ZERO_VALUE)
     handleLoading("Survey submission in progress...")
     const signal = pollAnswer.signal
     const externalNullifier = pollHash

     const identityCommitments = await getIdentityCommitments() // get all id-commitments from the semaphore contract.
     const identity = retrieveId() // get the IC, trapdoor and nullifier.
     const treeDepth = constants.treeDepth
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
     genProofReq.zeroValue = constants.ZERO_VALUE
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
         handleSuccess()
     } else {
        console.log("some error happened")
        handleError()
     }
}

  const handleUserChoice = (choice, survey) => {
    handleVote( choice, survey.options, survey.hash, survey._id, survey)
  }

  return (<Card {...props}>
    <CardHeader title="Latest Surveys" />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Survey Title
              </TableCell>
              <TableCell>
                NPS Score
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip
                  enterDelay={300}
                  title="Sort"
                >
                  <TableSortLabel
                    active
                    direction="desc"
                  >
                    Creation Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Expiry Date
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSurveys.map((survey) => (
              <TableRow
                hover
                key={survey._id}
              >
                <TableCell>
                  {survey.title}
                </TableCell>
                <TableCell>
                  {survey.npsScore}
                </TableCell>
                <TableCell>
                  {format(new Date(survey.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color={(survey.expiryLabel === 1 && 'success')
                    || (survey.expiryLabel === -1 && 'error')
                    || 'warning'}
                  >
                    {survey.expiryLabel === -1 ? 'Expired' : 'Valid' }
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  {format(new Date(survey.expiry), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <Button variant="contained" disabled={survey.expiryLabel === -1} onClick={() => {handleClickOpenDialog(survey)}}> Respond</Button>
                </TableCell>
              </TableRow> 
            ))}
          </TableBody>
        </Table>
        <RespondNPSSurveyComponent
          // id={selectedSurvey}
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
          survey={selectedSurvey}
          handleUserChoice={handleUserChoice}
        />
      </Box>
    </PerfectScrollbar>
  </Card>)
};
