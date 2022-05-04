import {useState, useEffect, useRef} from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import { generateMerkleProof, genNullifierHash, getPolls } from "src/services/apiCalls";
import {
    getIdentityCommitments,
    connectSemaphoreContract,
    packProof,
    broadcastSignal,
    voteOption
} from "src/services/logic"
import { handleError, handleLoading, handleSuccess } from "../alert/alert"
import { retrieveId, hasIdentityCreated } from "src/utils/storage"
import constants  from "src/constants/constants";
import Poll from "react-polls";


export default function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, survey, ...other } = props;
    // console.log(survey)
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleVote = async (voteAnswer, options, pollHash, pollId) => {
   
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
        console.log(pollAnswer, newVotes, constants.treeDepth, constants.ZERO_VALUE)
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

  const handleChange = (event) => {
    setValue(event.target.value);
    // add vote function
    console.log(survey, event.target.value)
    handleVote( event.target.value, survey.options, survey.hash, survey._id)
    onClose()
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="md"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>
        <Typography color="text.primary" variant="subtitle1" noWrap={true}>
            {survey.title}
        </Typography>
     </DialogTitle>
      <DialogContent >
        <Typography color="text.secondary" variant="subtitle2">
            {survey.description}
        </Typography>
      </DialogContent>
      <DialogContent dividers>
        <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={value}
            onChange={handleChange}
            ref={radioGroupRef}
        >
            {survey.options.map((option) => (       
            <FormControlLabel
                    value={option.signal}
                    key={option.hash}
                    control={<Radio />}
                    label={option.option}
                    sx={{px: 2}}
                />))}
        </RadioGroup>
        {/* <Poll
            question={survey._id}
            answers={survey.options}
            onVote={(voteAnswer) => handleVote(
                    voteAnswer,
                    survey.options,
                    survey.hash,
                    survey._id
                )
            }
            customStyles={{ theme: "cyan", align: "left" }}
            noStorage={true}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}


