const Web3 = require("web3");

// Set up Alchemy provider
const providerUrl = "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt";
const provider = new Web3(providerUrl);


// Create a new Web3 instance with the Alchemy provider
const web3 = new Web3(provider);

// Contract ABI and address
const contractABI = JSON.parse("[{\"type\":\"function\",\"name\":\"generateSeed\",\"constant\":true,\"stateMutability\":\"view\",\"payable\":false,\"inputs\":[{\"type\":\"uint256\",\"name\":\"nounId\"},{\"type\":\"address\",\"name\":\"descriptor\"},{\"type\":\"uint256\",\"name\":\"blockNumber\"}],\"outputs\":[{\"type\":\"tuple\",\"components\":[{\"type\":\"uint48\",\"name\":\"background\"},{\"type\":\"uint48\",\"name\":\"body\"},{\"type\":\"uint48\",\"name\":\"accessory\"},{\"type\":\"uint48\",\"name\":\"head\"},{\"type\":\"uint48\",\"name\":\"glasses\"}]}]}]")
const contractAddress = "0x402CF8456F05D111ABEe84F4209334Ba37729479"; // Insert the address of the deployed contract

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Call the fetchNextNoun function
contract.methods
  .fetchNextNoun()
  .call({ blockTag: "pending" }, (error, result) => {
    if (error) {
      console.error("Error calling fetchNextNoun:", error);
      return;
    }

    // Process the result
    const nounId = result[0];
    const seed = result[1];
    const svg = result[2];
    const price = result[3];
    const hash = result[4];

    console.log("Noun ID:", nounId);
    console.log("Seed:", seed);
    console.log("SVG:", svg);
    console.log("Price:", price);
    console.log("Hash:", hash);
  });






// const contractABI = JSON.parse("[{\"type\":\"function\",\"name\":\"generateSeed\",\"constant\":true,\"stateMutability\":\"view\",\"payable\":false,\"inputs\":[{\"type\":\"uint256\",\"name\":\"nounId\"},{\"type\":\"address\",\"name\":\"descriptor\"},{\"type\":\"uint256\",\"name\":\"blockNumber\"}],\"outputs\":[{\"type\":\"tuple\",\"components\":[{\"type\":\"uint48\",\"name\":\"background\"},{\"type\":\"uint48\",\"name\":\"body\"},{\"type\":\"uint48\",\"name\":\"accessory\"},{\"type\":\"uint48\",\"name\":\"head\"},{\"type\":\"uint48\",\"name\":\"glasses\"}]}]}]")