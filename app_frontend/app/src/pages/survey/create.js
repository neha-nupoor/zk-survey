import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, FormControl, FormLabel, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, TextField, Button, Snackbar, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DashboardLayout } from '../../components/dashboard-layout';

import { handleSuccess, handleError, handleLoading } from "../../components/alert/alert"
import { addSurvey } from 'src/services/logic';

const surveyTypes = [
    {
      value: 'NPS',
      label: 'NPS',
    }
];

const optionsArr = [
    {
        option: "1"
    },
    {
        option: "2"
    },
    {
        option: "3"
    },
    {
        option: "4"
    },
    {
        option: "5"
    },
    {
        option: "6"
    },
    {
        option: "7"
    },
    {
        option: "8"
    },
    {
        option: "9"
    },
    {
        option: "10"
    }
];

const Create = () => {
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 10)
    
    const router = useRouter();
    const [surveyType, setSurveyType] = useState('NPS');
    const [surveyTitle, setSurveyTitle] = useState("test-new-ui-demo");
    const [surveyDesc, setSurveyDesc] = useState("On a scale of 1 to 10, how likely are you to recommend our product to a friend?");
    const [expiryDate, setExpiryDate] = useState(expiry);
    const [openCreateFormError, setOpenCreateFormError] = useState(false);

    const handleSurveyTypeChange = (event) => {
        setSurveyType(event.target.value);
    };

    const handleExpiryDateChange = (newValue) => {
        setExpiryDate(newValue);
    };

    const handleSurveyTitleChange = e => setSurveyTitle(e.target.value)

    const handleSurveyDescChange = e => setSurveyDesc(e.target.value)

    const handleErrorClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
          }
        setOpenCreateFormError(false)
    }

    const handleCreateSurvey = async () => {
        if (surveyTitle == undefined || surveyDesc == undefined || surveyTitle.trim() == "" || surveyDesc.trim() == "" || expiryDate == undefined) {
            setOpenCreateFormError(true);
            return;
        } else {
            const data = {};
            data.title = surveyTitle;
            data.description = surveyDesc;
            data.options = optionsArr;
            data.expiry = expiryDate;
            handleLoading('Creating a new survey in 3..2..1..')
            const isSuccessful = await addSurvey(data)
            // setShow(false)
            if (isSuccessful) {
                handleSuccess(
                    "Transaction Successful",
                    "Go to dashboard to check your poll"
                )
                router.push({
                    pathname: '/',
                    // query: { returnUrl: router.asPath }
                });
                // getNewPollList()
                
            } else {
                handleError(
                    "Transaction Failed!",
                    "Try again with correct identity"
                )
            }
        }
    }
    

  return (<>
    <Head>
      <title>
        Create Surveys | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1
      }}
    >
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1.5, width: '50ch' },
      }}
      
      autoComplete="off"
    >
        <Container maxWidth="sm">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Survey Type</FormLabel>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Select"
                                value={surveyType}
                                onChange={handleSurveyTypeChange}
                                helperText="Please select the Survey type"
                                >
                                {surveyTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl>
                            {/* <FormLabel id="demo-row-radio-buttons-group-label">Survey Details</FormLabel> */}
                            
                            <FormLabel id="demo-row-radio-buttons-group-label">Survey ID</FormLabel>
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                // defaultValue={surveyTitle}
                                value={surveyTitle}
                                onChange={handleSurveyTitleChange}
                            />
                            
                            <FormLabel id="demo-row-radio-buttons-group-label">Survey Desc</FormLabel>
                            <TextField
                                required
                                id="outlined-disabled"
                                label="Disabled"
                                // defaultValue={surveyDesc}
                                value={surveyDesc}
                                onChange={handleSurveyDescChange}
                            />

                            <FormLabel id="demo-row-radio-buttons-group-label">Survey Expiration</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                label="Date&Time picker"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                                renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>        

                            
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Ratings</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                            {
                                 optionsArr.map((el) => {
                                 return (
                                    <Grid item xs={1} key={el.option} >
                                        <FormControlLabel key={el.option} value={el.option} control={<Radio />} label={el.option} />
                                     </Grid>)
                            })
                            }
                            
                                {/* <FormControlLabel value="1" control={<Radio />} label="One" />
                                <FormControlLabel value="2" control={<Radio />} label="Two" />
                                <FormControlLabel value="3" control={<Radio />} label="Three" />
                                <FormControlLabel value="4" control={<Radio />} label="Four" />
                                <FormControlLabel value="5" control={<Radio />} label="Five" />
                                <FormControlLabel value="6" control={<Radio />} label="Six" />
                                <FormControlLabel value="7" control={<Radio />} label="Seven" />
                                <FormControlLabel value="8" control={<Radio />} label="Eight" />
                                <FormControlLabel value="9" control={<Radio />} label="Nine" />
                                <FormControlLabel value="10" control={<Radio />} label="Ten" /> */}
                            </RadioGroup>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                    <Box sx={{
                        flexGrow: 1,
                        py: 2,
                        m: 1,
                    }}>
                        <Button variant="contained" onClick={handleCreateSurvey}>Submit</Button>
                    </Box>
                </Grid>
                
            </Grid>
        </Container>
    </Box>
    </Box>
    <Snackbar open={openCreateFormError} autoHideDuration={6000} onClose={handleErrorClose} anchorOrigin={{vertical : "bottom", horizontal:  "center" }} >
        <Alert severity="error" sx={{ width: '100%' }} onClose={handleErrorClose} >
            Please fill in all the details
        </Alert>
    </Snackbar>
  </>)
};

Create.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Create;
