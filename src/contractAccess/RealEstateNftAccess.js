import RealEstateABI from './RealEstateNftABI.json';
import { NFTStorage } from 'nft.storage'

const { ethers } = require("ethers");

const contractABI = RealEstateABI;
const contractAddress = "0x7F423aF9E2c300B62342dfeA2a2F2aEb3Bc7D5BE";

export async function mintRealEstateNFT(streetAddress, state, initialAssessedValue, signer) {

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Upload metadata to IPFS
    const metadata = {
        streetAddress: streetAddress,
        state: state,
        initialValue: String(initialAssessedValue)
    };

    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_SECRET });

    const token = await nftstorage.store({ image: new File([],"RealEstate"), name: "Real Estate Asset - "+streetAddress,
            description: JSON.stringify(metadata)});

    // Mint NFT with metadata IPFS hash
    console.log(signer.address);
    const tx = await contract.mint(signer.address, token.url);

    console.log("NFT Minted:", tx.hash);
}