// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running the script with `npx hardhat run <script>` you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   const redContract = ethers.getContractFactory("Red");
//   const blueContract = ethers.getContractFactory("Blue");
//   const greenContract = ethers.getContractFactory("Green");
//   const yellowContract = ethers.getContractFactory("Yellow");
//   //We get the contract to deploy

//   // Game Logic
//   const GameLogic = await hre.ethers.getContractFactory("GameLogic");
//   const gameLogic = await GameLogic.deploy(
//     "0x5FbDB2315678afecb367f032d93F642f64180aa3",
//     "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//     "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
//     "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
//   );
  
//   await gameLogic.deployed();
//   console.log("GameLogic deployed to:", gameLogic.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
