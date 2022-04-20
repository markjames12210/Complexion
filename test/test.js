const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("GameLogic", function () {

	before(async function () {
		GameLogic = await ethers.getContractFactory("GameLogic");
		Red = await ethers.getContractFactory("Red");
		Blue = await ethers.getContractFactory("Blue");
		Green = await ethers.getContractFactory("Green");
		Yellow = await ethers.getContractFactory("Yellow");
	});

  	beforeEach(async function () {
		// Deploy Red NFT
		cRed = await Red.deploy();
		await cRed.deployed();
		// Deploy Blue NFT
		cBlue = await Blue.deploy();
		await cBlue.deployed();
		// Deploy Green NFT
		cGreen = await Green.deploy();
		await cGreen.deployed();
		// Deploy Yellow NFT
		cYellow = await Yellow.deploy();
		await cYellow.deployed();
		// Deploy GameLogic with the above color contracts
		let args = [cRed.address, cBlue.address, cGreen.address, cYellow.address];
		cGameLogic = await GameLogic.deploy(...args);
		await cGameLogic.deployed();
		
		//Transfer Owner to GameLogic
		cRed.transferOwnership(cGameLogic.address);
		cBlue.transferOwnership(cGameLogic.address);
		cYellow.transferOwnership(cGameLogic.address);
		cGreen.transferOwnership(cGameLogic.address);
	});
		
	const prices = [0.12, 0.15, 0.18, 0.22, 0.25, 0.3, 0.38, 0.45, 0.6]; // sums to 2.65E + 0.1E = 2.75E

	it("Check that players cannot vote more than 10 times after a round is finished", async function() {
		const accounts = await ethers.getSigners();
		await expect(cGameLogic.connect(accounts[0]).voteForColor(1, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 1);
		for (let i = 0; i < 9; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(1, { value: ethers.utils.parseEther(prices[i].toString()) });
		}
		await expect(cGameLogic.voteForColor(1, { value: ethers.utils.parseEther("0.6")})).to.be.revertedWith("Round ended");
	});

	it("Check that players can only vote for red, blue, green or yellow", async function() {
		await expect(cGameLogic.voteForColor(5, { value: ethers.utils.parseEther("0.1")})).to.be.revertedWith("Wrong color");
	});
	
	it("Check that a single wallet can only vote once per round", async function() {
		const accounts = await ethers.getSigners();
		await expect(cGameLogic.voteForColor(1, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 1);
		await expect(cGameLogic.voteForColor(1, { value: ethers.utils.parseEther("0.12")})).to.be.revertedWith("Already voted this round");
	});

	it("Check if reawards are distributed correctly", async function() {
		const accounts = await ethers.getSigners();
		provider = ethers.provider;
		const prices = [0.12, 0.15, 0.18, 0.22, 0.25, 0.3, 0.38, 0.45, 0.6]; // sums to 2.65E + 0.1E = 2.75E
		// Vote for Blue 9 Times (Losing Team) 
		await expect(cGameLogic.connect(accounts[0]).voteForColor(2, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 2);
		for (let i = 0; i < 8; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(2, { value: ethers.utils.parseEther(prices[i].toString()) });
		}
		// Vote for Red 10 Times (Winning Team)
		await expect(cGameLogic.connect(accounts[9]).voteForColor(1, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[9].address, ethers.utils.parseEther("0.1"), 0, 1);
		for (let j = 9; j < 18; j ++) {
			var Redcolor = await cGameLogic.connect(accounts[j+1]).voteForColor(1, { value: ethers.utils.parseEther(prices[j-9].toString())});
		}
		// Check that the reward has been sent to the first minter for Red
		cGameLogic.connect(accounts[10]).claimReward();
		expect(await ethers.provider.getBalance(accounts[10].address)).to.changeEtherBalance(accounts[10].address, 0.33210);;
	});

	it("Check that only a voter of the winning color can mint an NFT", async function() {
		const accounts = await ethers.getSigners();
		provider = ethers.provider;
		// Vote for Blue 10 Times
		await expect(cGameLogic.connect(accounts[0]).voteForColor(2, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 2);
		for (let i = 0; i < 9; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(2, { value: ethers.utils.parseEther(prices[i].toString())});
		}
		await cGameLogic.connect(accounts[0]).mintWinner();
		await expect (cGameLogic.connect(accounts[10]).mintWinner()).to.be.revertedWith("have to vote");
	});

	it("Check that only a winner can claim a reward ", async function() {
		const accounts = await ethers.getSigners();
		provider = ethers.provider;
		// Vote for Blue 10 Times
		await expect(cGameLogic.connect(accounts[0]).voteForColor(2, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 2);
		for (let i = 0; i < 9; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(2, { value: ethers.utils.parseEther(prices[i].toString())});
		}
		await cGameLogic.connect(accounts[0]).claimReward();
		await expect (cGameLogic.connect(accounts[10]).claimReward()).to.be.revertedWith("have to vote");
	});

	it("Check that a winner cannot claim and reward AND mint an NFT ", async function() {
		const accounts = await ethers.getSigners();
		provider = ethers.provider;
		// Vote for Blue 10 Times
		await expect(cGameLogic.connect(accounts[0]).voteForColor(2, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 2);
		for (let i = 0; i < 9; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(2, { value: ethers.utils.parseEther(prices[i].toString())});
		}
		await cGameLogic.connect(accounts[0]).claimReward()
		await expect (cGameLogic.connect(accounts[0]).mintWinner()).to.be.revertedWith("Already claimed reward for this round");
	});

	it("Check that a round cannot reset until round is finished", async function() {
		const accounts = await ethers.getSigners();
		provider = ethers.provider;
		// Vote for Blue 9 Times
		await expect(cGameLogic.connect(accounts[0]).voteForColor(2, { value: ethers.utils.parseEther("0.1") })).to.emit(cGameLogic, "Voted").withArgs(accounts[0].address, ethers.utils.parseEther("0.1"), 0, 2);
		for (let i = 0; i < 9; i ++) {
			var color = await cGameLogic.connect(accounts[i+1]).voteForColor(2, { value: ethers.utils.parseEther(prices[i].toString())});
		}
		await expect (cGameLogic.connect(accounts[0]).reset()).to.be.revertedWith("Not yet ready");
	});


 })

