# Complexion


Complexion is a Gaming Dapp that combines the concept of Defi and NFTs and provides players with interesting game theory. There are four teams that are racing and competing against each other (Red, Blue, Green Yellow). The team’s score increases every time a player votes. One wallet can only vote once for a single color per round. The first team that gets 10 points wins the round. Price to vote is on a bonding curve with the first NFT priced at 0.1 ETH and the last at 0.6 ETH. When you win, what exactly do you get as a prize? The first option is to claim the reward which is derived from all of the ETH spent to vote on the non-winning colors by other players. The ETH spent to vote from the losing team will be divided up by anyone on the winning team who decides to claim the reward. If a winner forgoes the reward, the player has the option to mint the NFT of the winning color and keep it as a trophy. Utility for the NFT will be added in the next iteration. 

# Advanced Sample Hardhat Project


This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
