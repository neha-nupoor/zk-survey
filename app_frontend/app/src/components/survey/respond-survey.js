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

export default function RespondNPSSurveyComponent(props) {
  const { onClose, value: valueProp, open, survey, ...other } = props;
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

  const handleChange = (event) => {
    setValue(event.target.value);
    // add vote function
    console.log(survey, event.target.value)
    props.handleUserChoice(event.target.value, survey);
    // handleVote( event.target.value, survey.options, survey.hash, survey._id, survey)
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
            {survey.options ? survey.options.map((option) => (       
            <FormControlLabel
                    value={option.signal}
                    key={option.hash}
                    control={<Radio />}
                    label={option.option}
                    sx={{px: 2}}
                />)) : null}
        </RadioGroup>
       
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}


