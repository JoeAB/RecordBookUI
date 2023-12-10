// Import necessary modules from ethers library
import { ethers, JsonRpcProvider } from "ethers";
// Import the dotenv module to load environment variables

// Import the ABI of the NewsArchive contract
import MdParcelDataABI from "./MdParcelDataABI.json";



// Get provider URL and contract address from environment variables
const providerUrl = "https://rpc.sepolia.org";//process.env.PROVIDER_URL;
const contractAddress = "0xcBA380CE15dDbF6C1713C5513063B7D209400621";//process.env.CONTRACT_ADDRESS;

// Create a new JSON-RPC provider
const provider = new JsonRpcProvider(providerUrl);

// Create a new contract instance with the NewsArchive ABI


// Define an async function to get all properties from the contract
export async function getSearchResult() {
    const parcelDataContract = new ethers.Contract(
        contractAddress,
        MdParcelDataABI,
        provider
      );
  try {
    const labels = await parcelDataContract.getSearchResult();
    // Return the property labels
    return labels;
  } catch (error) {
    // Log the error and return an empty array
    console.error("Error fetching property data:", error);
    return [];
  }
}

export async function searchData(addressLookUp, signer) {
    const parcelDataContract = new ethers.Contract(
        contractAddress,
        MdParcelDataABI,
        signer
      );
    try {
      // Call the sendRequest function of the contract
      alert(parcelDataContract.runner);
      await parcelDataContract.sendRequest(addressLookUp);

    } catch (error) {
      // Log the error and return an empty array
      console.error("Error sending request:", error);
    }
  }