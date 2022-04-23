const constants = {
    // HOST_URL: process.env.REACT_APP_HOST_URL || 'http://localhost:5000',
    HOST_URL: process.env.REACT_APP_HOST_URL || 'https://zksurvey-backend.vercel.app',
    // HOST_URL: process.env.REACT_APP_HOST_URL || 'https://anonyvote.herokuapp.com',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    poll_options: 10
  }
  
  export default constants
  