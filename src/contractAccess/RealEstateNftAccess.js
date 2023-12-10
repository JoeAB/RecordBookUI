import RealEstateABI from './RealEstateNftABI.json';
import { NFTStorage } from 'nft.storage'

const { ethers } = require("ethers");

const contractABI = RealEstateABI;
const contractAddress = "0x29e43576c9A7EBcf38c0ded93d32E0ab06934977";

export async function mintRealEstateNFT(streetAddress, state, initialAssessedValue, signer) {

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Upload metadata to IPFS
    const metadata = {
        streetAddress: streetAddress,
        state: state,
        initialValue: String(initialAssessedValue)
    };

    const nftstorage = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGExRDU3MWEzZkFENzAwRWQ4QmJDMzlkRTM3REQwMjA0NTA3NzgwODIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4Mjg2MDk4MzYzMCwibmFtZSI6InRlc3RORlRQb2x5In0.fDWljOONJq7F6texYx7Wgj7BmgGxrop9vIyKLqk1ZGQ" })

    const token = await nftstorage.store({ image: new File([],"RealEstate"), name: "Real Estate Asset - "+streetAddress,
            description: JSON.stringify(metadata)});

    // Mint NFT with metadata IPFS hash
    const tx = await contract.mint(signer.address, token.url);

    console.log("NFT Minted:", tx.hash);
}