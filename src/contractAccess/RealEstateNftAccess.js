import RealEstateABI from './RealEstateNftABI.json';
const { ethers } = require("ethers");
const IPFS = require("ipfs-http-client");

const polygonRPC = "https://rpc-mumbai.maticvigil.com/";
const privateKey = "YOUR_PRIVATE_KEY";
const ipfs = IPFS.create();

const contractABI = RealEstateABI;
const contractAddress = "0x63827e1E66f79ef9E93c15292AAA59205d88720c";

async function mintRealEstateNFT(streetAddress, state, initialAssessedValue) {
    const provider = new ethers.providers.JsonRpcProvider(polygonRPC);
    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Upload metadata to IPFS
    const metadata = {
        name: streetAddress + ", "+ state,
        initialValue: initialAssessedValue,
    };

    const uploaded = await ipfs.add(JSON.stringify(metadata));

    // Mint NFT with metadata IPFS hash
    const tx = await contract.mint(wallet.address, uploaded.path);

    console.log("NFT Minted:", tx.hash);
}