const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  console.log("Deploying Marketplace...");
  const marketplace = await Marketplace.deploy();
  console.log("Marketplace deployed to:", `https://testnet.aurorascan.dev/address/${marketplace.address}`);

  await marketplace.deployed();

  const marketplaceData = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./contracts/abi/marketplace.json', JSON.stringify(marketplaceData))

  const NFT = await hre.ethers.getContractFactory("NFT");
  console.log("Deploying NFT...");
  const nft = await NFT.deploy(marketplace.address);
  console.log("NFT deployed to:", `https://testnet.aurorascan.dev/address/${nft.address}`);
  const VialNFT = await hre.ethers.getContractFactory("VialNFT");
  console.log("Deploying VialNFT...");
  const vialNFT = await VialNFT.deploy(marketplace.address);
  console.log("VialNFT deployed to:", `https://testnet.aurorascan.dev/address/${vialNFT.address}`);

  await nft.deployed();
  await vialNFT.deployed();

  const nftData = {
    address: nft.address,
    abi: JSON.parse(nft.interface.format('json'))
  }

  const vialNftData = {
    address: vialNFT.address,
    abi: JSON.parse(vialNFT.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./contracts/abi/nft.json', JSON.stringify(nftData))
  fs.writeFileSync('./contracts/abi/vialNFT.json', JSON.stringify(vialNftData))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
