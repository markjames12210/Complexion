//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "hardhat/console.sol";

interface IRed {
    function mintWinner(address) external;
    function burn(uint256) external;
    function ownerOf(uint256 tokenId) external returns (address);
}

interface IBlue {
    function mintWinner(address) external;
    function burn(uint256) external;
    function ownerOf(uint256 tokenId) external returns (address);
}
interface IGreen {
    function mintWinner(address) external;
    function burn(uint256) external;
    function ownerOf(uint256 tokenId) external returns (address);
}
interface IYellow {
    function mintWinner(address) external;
    function burn(uint256) external;
    function ownerOf(uint256 tokenId) external returns (address);
}
interface ISpecialNFT {
    function mintWinner(address) external;
}

contract GameLogic is PullPayment, ReentrancyGuard{
    uint256 public roundNumber = 0;
    uint256 public winningColor;
    uint256 public winningRound;
    uint256 public currentRoundPool;
    address public sidePotPool;
    uint256 public resetTime;
    uint256 public votersInRound;
    bool public winningStatus;

    mapping(uint256 => NFT) public colorToNFT;
    //mapping(uint256 => bool) public winnerRound;
    //mapping(string => bool) public winnerColor;

    mapping(address => mapping(uint => Voter)) public roundToVoter; // address => round => Voter struct

    event Voted(
        address voter,
        uint256 price,
        uint256 roundNumber,
        uint256 color
    );

    struct NFT {
        uint256 mintPrice;
        uint256 oldSupply;
        uint256 color;
    }

    NFT public red = NFT(0.1 ether, 0, 1);
    NFT public blue = NFT(0.1 ether, 0, 2);
    NFT public green = NFT(0.1 ether, 0, 3);
    NFT public yellow = NFT(0.1 ether, 0, 4);

    IRed public redContract;
    IBlue public blueContract;
    IGreen public greenContract;
    IYellow public yellowContract;
    ISpecialNFT public specialNFTContract;

    struct Voter {
        bool voted;
        uint256 color;
        uint256 mintPrice;
        bool minted;
        bool claimedReward;
    }

    struct WinnerRound {
        Voter winner;
        NFT roundRedStatus;
        NFT roundBlueStatus;
        NFT roundGreenStatus;
        NFT roundYellowStatus;
    }

    constructor (
        address _red,
        address _blue,
        address _green,
        address _yellow
    ) {
        // _red = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        // _blue = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        // _green = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;
        // _yellow = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;

        // references to other contracts
        redContract = IRed(_red);
        blueContract = IBlue(_blue);
        greenContract = IGreen(_green);
        yellowContract = IYellow(_yellow);

        colorToNFT[1] = red;
        colorToNFT[2] = blue;
        colorToNFT[3] = green;
        colorToNFT[4] = yellow;
    }

    // WinnerRound[] winners;
    // query give me winnerRound[1]

    // red = 1
    // blue = 2
    // green = 3
    // yellow = 4

    function votingPrice(uint256 _color) public view returns (uint256) {
        uint256 supply = colorToNFT[_color].oldSupply;
        uint256 price = 0.1 ether;
        if (supply >= 9) {
            price = 0.6 ether;
        } else if (supply >= 8) {
            price = 0.45 ether;
        } else if (supply >= 7) {
            price = 0.38 ether;
        } else if (supply >= 6) {
            price = 0.3 ether;
        } else if (supply >= 5) {
            price = 0.25 ether;
        } else if (supply >= 4) {
            price = 0.22 ether;
        } else if (supply >= 3) {
            price = 0.18 ether;
        } else if (supply >= 2) {
            price = 0.15 ether;
        } else if (supply >= 1) {
            price = 0.12 ether;
        }
        return price;
    }

    function voteForColor(uint256 _color) public payable {
        NFT storage currentNFT = colorToNFT[_color];

        // require timechecking based on reset time;
        // get price
        uint256 price = votingPrice(currentNFT.color);
//        uint256 nextPrice = currentNFT.oldSupply + 1 > 0 ? price + (price / 5) : price;
        // check value being sent for vote
        require(msg.value == price, "Insufficient amount");
        require(_color >= 1 && _color <= 4, "wrong color");
        require(currentNFT.oldSupply < 10, "Round ended");
//        require(roundToVoter[msg.sender][roundNumber].voted == false, "Already voted this round"); // check player hasn't voted this round);
        // update NFT supply
        currentNFT.oldSupply += 1;
        // assign color
        currentNFT.color = _color;
        // asign color to voter
        roundToVoter[msg.sender][roundNumber].color = _color;

        // assign price to mintPrice in struct
        currentNFT.mintPrice = price;
        roundToVoter[msg.sender][roundNumber].mintPrice = price;

        console.log("Price is ", price);
        console.log("Supply is ", currentNFT.oldSupply);
        console.log("Round number is ", roundNumber);

        // Calcualte distribution and send ETH to currentPool and sidePoool using PullPayment

        uint256 valueSentWhenVoting = msg.value * 90 / 100;
         _asyncTransfer(msg.sender, valueSentWhenVoting);
        // _asyncTransfer(sidePotPool, msg.value * 9 / 100);
        currentRoundPool += msg.value;
        // if the 10th NFT is minted there is a winning color
        if (currentNFT.oldSupply == 10) {
            winningRound = roundNumber;
            winningColor = currentNFT.color;
            winningStatus = true;
        }

        // update voted to true
        roundToVoter[msg.sender][roundNumber].voted = true;
        // count total voters for this round
        votersInRound += 1;
        // reset timer
        resetTime = block.timestamp + 86400;

        emit Voted(msg.sender, currentNFT.mintPrice, roundNumber, _color);
    }

    function redeemAll() public {
        withdrawPayments(payable (msg.sender));
    }

    // Winners from the round can claim round reward or mint NFT
    function claimReward() external payable nonReentrant {
        require(roundToVoter[msg.sender][winningRound].voted == true, "have to vote");
//        require(roundToVoter[msg.sender][winningRound].color == winningColor, "have to be winning color");
        require(roundToVoter[msg.sender][winningRound].claimedReward == false, "Already claimed reward for this round");
//        require(roundToVoter[msg.sender][winningRound].minted == false, "Already minted this round");
        // calculation for prize pool per voter based on voters in round
        console.log("currentRoundPool ", currentRoundPool);
        console.log("votersInRound ", votersInRound);
        console.log("amount ", (currentRoundPool - ((currentRoundPool / votersInRound) * 10))/10);
        _asyncTransfer(msg.sender, (currentRoundPool - ((currentRoundPool / votersInRound) * 10))/10);

        redeemAll();
        console.log("balance after redeemAll", msg.sender.balance);
        roundToVoter[msg.sender][winningRound].claimedReward = true;
    }


    function mintWinner() external payable nonReentrant {
        require(roundToVoter[msg.sender][winningRound].voted == true, "have to vote");
        require(roundToVoter[msg.sender][winningRound].color == winningColor, "have to be winning color");
//        require(roundToVoter[msg.sender][winningRound].claimedReward == false, "Already claimed reward for this round");
        require(roundToVoter[msg.sender][winningRound].minted == false, "Already minted this round");

        roundToVoter[msg.sender][winningRound].color == 1 ? redContract.mintWinner(msg.sender)
        : roundToVoter[msg.sender][winningRound].color == 2 ? blueContract.mintWinner(msg.sender)
        : roundToVoter[msg.sender][winningRound].color == 3 ? greenContract.mintWinner(msg.sender)
        : yellowContract.mintWinner(msg.sender);

        // have to know the amount sent
        // have to calculate the pool prize
        roundToVoter[msg.sender][winningRound].minted = true;
    }
        // let the user pass the tokenIDs in a deterministic order. So an array of 4 values wherein the first value corresponds to red color, second to blue, third to green, foruth to yellow.
        // iterate over the 4 tokenIDs, and call the ownerOf method of respsective color contracts and require that the owner is msg.sender. If it's not the contract would revert and execution stops
        // Iterate over the 4 tokenIds again and burn them
        // Mint special NFT

    function mintSpecialNFT(uint256[] calldata tokenIds) external {
        uint256 count = tokenIds.length;
        require(count <= 4, "Too many tokens");
        address redOwner = redContract.ownerOf(tokenIds[0]);
        address blueOwner = blueContract.ownerOf(tokenIds[1]);
        address greenOwner = greenContract.ownerOf(tokenIds[2]);
        address yellowOwner = yellowContract.ownerOf(tokenIds[3]);
        require(msg.sender ==  redOwner, "You don't own red");
        require(msg.sender ==  blueOwner, "You don't own blue");
        require(msg.sender ==  greenOwner, "You don't own green");
        require(msg.sender ==  yellowOwner, "You don't own yellow");
        redContract.burn(tokenIds[0]);
        blueContract.burn(tokenIds[1]);
        greenContract.burn(tokenIds[2]);
        yellowContract.burn(tokenIds[3]);
        specialNFTContract.mintWinner(msg.sender);
}


    function reset() external {
            require(block.timestamp > resetTime, "Not yet ready");
            require(winningStatus == true, "Round is not finished");
            // WinnerRound[roundNumber] = (

            // );
            winningColor = 0;
            roundNumber += 1;
            // reset structs for all colors
            red.oldSupply = 0;
            red.mintPrice = 0.1 ether;
            blue.oldSupply = 0;
            blue.mintPrice = 0.1 ether;
            yellow.oldSupply = 0;
            yellow.mintPrice = 0.1 ether;
            green.oldSupply = 0;
            green.mintPrice = 0.1 ether;

            winningStatus = false;
        }
}




