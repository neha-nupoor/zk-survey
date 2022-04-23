# ZK-Survey

## Description
This project will focus on building a decentralized survey platform that will allow users to anonymously verify they belong to a set of registered users and take a NPS survey for a DAO by signaling their endorsement of a particular string[1-10 score in this case].
This portal will allow anyone to create a NPS survey and automatically become the coordinator of the survey. Users can then register to take the survey. We will be using Zero Knowledge proofs to handle the registration and survey choices by the users. Each survey will have a unique external nullifier and the user will only be able to vote once per external nullifier.

## How It Works
The application will be subdivided into three projects namely the backend which is built with Express.js, the frontend built with React and the Contracts to be deployed on Harmony blockchain. The three interfaces will come together to provide the users with a complete platform where they can anonymously fill a survey and the records will be stored on the blockchain.
No personally identifiable data is stored on the backend servers or the blockchain and each user is identified with their identity commitment that is either stored on the browser or by the user.

## Future Roadmap
There is a great deal of activities to be done to meet the needs of the users and some of them outlined for the short and long term are:
- Improve UI for survey authors and survey takers
- Ability to register DAOs as an entity on the portal and restrict their surveys to only their members
- Access control to push out surveys to only pre-defined members
- Release a governance token to manage the portal effectively, and incentivize users to take the surveys
- Survey's data analysis
- Move the NPS calculation to blockchain
- Allow users to take different surveys in an interface like Google forms. Use it for governance and documentation purposes for a DAO.
- Move the data to IPSF

## Demo
The application is live at [ZKSurvey](https://zksurvey-frontend.vercel.app/home)