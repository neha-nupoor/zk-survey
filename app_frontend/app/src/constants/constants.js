const constants = {
    // HOST_URL: process.env.REACT_APP_HOST_URL || 'http://localhost:8000',
    // HOST_URL: process.env.REACT_APP_HOST_URL || 'https://zksurvey-backend.vercel.app',
    HOST_URL: process.env.REACT_APP_HOST_URL || 'https://zk-survey-backend.herokuapp.com/',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    poll_options: 10,
    ZERO_VALUE:"56568702409114342732388388764660722017601642515166106701650971766248247995328",
    treeDepth:20,
  }
  
  export default constants
  