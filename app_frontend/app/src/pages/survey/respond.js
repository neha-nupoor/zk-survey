import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import { RespondersSurvey } from "../../components/survey/responder";
import { getAllSurveys } from "../../services/logic";
import { useEffect, useState } from 'react';

const Respond = () => {
    const [surveys, setSurveys] = useState([])
    const [signerAddress, setSignerAddress] = useState(null)

    // TODO: Pass this in an upper and use context API for this.
    useEffect(()=> {
        getAllSurveys().then((polls) => {
        setSurveys(polls)
        if (window.signer !== undefined) {
            window.signer.getAddress().then(res => {
              setSignerAddress(res)
            })
          }
        })
    }, [])

    const handleUserVote = (userChoice, survey) => {
      console.log(userChoice, survey)
    }

  return (
  <>
    <Head>
      <title>
        Products | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
       
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <RespondersSurvey surveys={surveys} signeraddress={signerAddress} />
          </Grid>
            
          </Grid>
        </Box>
        
      </Container>
    </Box>
  </>
)
};

Respond.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Respond;
