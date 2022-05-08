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

## Quick start

- Clone the repo.

- Make sure your NodeJS and npm versions are up to date for `React 17`

- Install dependencies: `npm install` or `yarn`

- Start the server: `npm run dev` or `yarn dev`

- Views are on: `localhost:3000`

## File Structure

Within the download you'll find the following directories and files:

```
material-kit-react

┌── .eslintrc.json
├── .gitignore
├── CHANGELOG.md
├── jsconfig.json
├── LICENSE.md
├── package.json
├── README.md
├── public
└── src
	├── __mocks__
	├── components
	├── icons
	├── theme
	├── utils
	└── pages
		├── 404.js
		├── _app.js
		├── _document.js
		├── account.js
		├── customers.js
		├── index.js
		├── login.js
		├── products.js
		├── register.js
		└── settings.js
		└── survey/survey*.js
```

## Resources

- More freebies like this one: <https://devias.io>

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run start

# Run in prod mode
npm run build
```

## Demo
The application is live at [ZKSurvey](https://zk-survey-frontend.vercel.app/)


## To deploy to Heroku
- Deploy via CLI
- Run `git subtree push --prefix backend heroku master` from root of the git repo.
- References: 
    - https://devcenter.heroku.com/articles/git#create-a-heroku-remote
    - https://devcenter.heroku.com/articles/deploying-nodejs

## Contributions:
- This project is forked from Anonyvote to leverage the Semaphore login and backend survey management. It was created by @tosin and he has provided immense help offline to set up the project.
- The UI is forked off of [Material Kit - React](https://material-kit-react.devias.io/) theme and is built on top of it.

