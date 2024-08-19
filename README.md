# Solidity Project: Staking Platform with Variable APY

## Project Overview

You will be developing a **staking platform** in Solidity, where users can stake ERC20 tokens and earn rewards with variable Annual Percentage Yields (APY). This project is designed to help you build strong foundational skills in Solidity and prepare you for real-world development work.

# Staking Platform

This project is a Solidity-based staking platform using the Hardhat framework and an ERC20 token. The frontend is developed using Vue.js.

## Project Setup

Before starting, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hardhat](https://hardhat.org/)

Clone the repository and install the dependencies:

```bash
git clone <repository_url>
cd staking-platform
npm install
```

Navigate to the `frontend` directory and install its dependencies:

```
cd frontend
npm install
```

## Environment Variables

Create a .env file at the root of the project to configure the environment variables. You can use the .env.example file as a reference.

```
cp .env.example .`env`
```

The `.env file should include:

```
STAKING_ADDRESS=
TOKEN_ADDRESS=
```

## Commands

### Hardhat (Solidity)

- Compile Solidity contracts: `npm run compile`
- Run tests : `npm run test`
- Run a local Hardhat node: `npm run node`
- Deploy contracts locally: `npm run deploy`
- Generate test coverage: `npm run coverage`
- Lint Solidity contracts: `npm run lint:sol`
- Fix Solidity linting issues: `npm run lint:fix`

### Frontend (Vue.js)

- Start the development server: `npm run frontend:dev`
- Serve the built frontend locally: `npm run frontend:serve`

## Running the Project

1. Start the local Hardhat node:
```
npm run node
```
2. Deploy the contracts to the local network. In a new terminal, run: 
```
npm run deploy
```
3. Start the frontend development server. Navigate to the `frontend` directory and run:
```
npm run frontend:dev
```
4. From the previous console, copy and paste the values of token contract and staking contract into the file `.env`
5. Access the frontend:
   Open your browser and navigate to `http://localhost:3000` or the port specified by the development server.

