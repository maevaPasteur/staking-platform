# Solidity Project: Staking Platform with Variable APY

## Project Overview

This project is a Solidity-based staking platform using the Hardhat framework and an ERC20 token. The frontend is developed using Vue.js.

### Project Setup

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

### Environment Variables

Create a .env file at the root of the project to configure the environment variables. You can use the .env.example file as a reference.

```
cp .env.example .`env`
```

The `.env file should include:

```
STAKING_ADDRESS=
TOKEN_ADDRESS=
```

### Commands

- Compile Solidity contracts: `npm run compile`
- Run tests : `npm run test`
- Run a local Hardhat node: `npm run node`
- Deploy contracts locally: `npm run deploy`
- Generate test coverage: `npm run coverage`
- Lint Solidity contracts: `npm run lint:sol`
- Fix Solidity linting issues: `npm run lint:fix`
- Serve the built frontend locally: `npm run frontend:dev`


---

## Running the Project

1. `npm install`
2. `cd frontend && pnpm install && cd ../`
3. `npx hardhat compile`
4. `npx hardhat node`
5. In a new terminal : `npx hardhat run scripts/deploy.js --network localhost`
6. Copy & paste the contracts addresses into `.env`
7. `npm run frontend:dev`
8. Open your localhost