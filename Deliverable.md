# Solidity Project: Staking Platform with Variable APY

## Project Overview

You will be developing a **staking platform** in Solidity, where users can stake ERC20 tokens and earn rewards with variable Annual Percentage Yields (APY). This project is designed to help you build strong foundational skills in Solidity and prepare you for real-world development work.

## Deliverables

### 1. Smart Contracts
- **Staking Contract**:
    - Users should be able to stake an ERC20 token.
    - Rewards should be calculated based on a variable APY.
    - Include functions for staking, withdrawing, and claiming rewards.
- **ERC20 Token Contract**:
    - Implement an ERC20 token that users will stake.

  Both contracts must be well-documented using **NatSpec** (Solidity’s documentation format).

### 2. Repository and Version Control
- **GitHub Repository**: Set up a repository on GitHub.
- **Branching Strategy**: Follow the **Gitflow** workflow:
    - Work on the `dev` branch.
    - Create feature branches for new functionalities.
    - When ready, create a release branch, and merge it into the `main` branch.
    - I will review the code before merging into `main`. Add me as a reviewer: `@aboudjem`.
- **Commit History**: Ensure that all progress is well-documented through meaningful commit messages.

### 3. Code Quality and Style
- **Style Guide**: Follow the [Solidity Style Guide](https://github.com/Aboudjem/solidity-style-guide).
- **Linting**: Use `solhint` for Solidity linting, optionally combined with `prettier` for code formatting.
- **Documentation**: All code must be well-documented to ensure readability and maintainability.

### 4. Testing
- **Full Test Coverage**:
    - Write comprehensive tests to cover all functionalities.
    - Use a framework of your choice: **Hardhat** or **Foundry**.
    - Aim for 100% test coverage. Optionally integrate with **Coveralls** or **Codecov** to track coverage.
- **Deployment**:
    - Deploy the contracts to a testnet (e.g., Goerli or Sepolia).
    - Verify the contracts on Etherscan.

### 5. Continuous Integration (CI)
- **GitHub Actions**:
    - Set up CI workflows to automatically run tests and lint the code on each commit.
    - Optionally integrate with coverage tools (Coveralls or Codecov).

### 6. Frontend Integration (Bonus)
- **Frontend**:
    - If possible, create a simple frontend to interact with the staking platform.
    - Integrate with MetaMask for wallet interactions.

## Additional Notes
- This project will serve as one of several that will help build your portfolio and GitHub profile, showcasing real-world projects.
- Foundry is a more advanced framework, and we can consider using it for future projects.
- Ensure that the `package.json` file includes scripts for common tasks:
    - `lint`: Runs the linter.
    - `lint:fix`: Runs the linter and automatically fixes issues.
    - `test`: Runs the tests.
    - `coverage`: Runs the tests and reports coverage.

This project is a solid step toward mastering Solidity and preparing for any development work in the blockchain space.

Good luck!