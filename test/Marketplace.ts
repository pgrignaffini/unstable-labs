const { expect } = require("chai");

describe("Marketplace contract", function () {
    async function deployMarketplaceFixture() {
        const Marketplace = await ethers.getContractFactory("Marketplace");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const marketplace = await Marketplace.connect(owner).deploy();

        await marketplace.deployed();

        const NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.deploy(marketplace.address);
        const VialNFT = await ethers.getContractFactory("VialNFT");
        const vialNFT = await VialNFT.deploy(marketplace.address);

        await nft.deployed();
        await vialNFT.deployed();

        return { marketplace, nft, vialNFT, owner, addr1, addr2 };
    }

    it("Should create and execute market sales", async function () {
        const { marketplace, nft } = await deployMarketplaceFixture();

        // Create NFT
        await nft.mintToken("https://www.mytokenURI.com");
        await nft.mintToken("https://www.mytokenURI2.com");


        await marketplace.createMarketItem(
            nft.address,
            1,
            ethers.utils.parseUnits("1", "ether")
        );

        await marketplace.createMarketItem(
            nft.address,
            2,
            ethers.utils.parseUnits("1", "ether")
        );


        let items = await marketplace.fetchAvailableMarketItems();
        expect(items.length).to.equal(2);

        const item = await marketplace.getLatestMarketItemByTokenId(1);
        expect(item[0].price).to.equal(ethers.utils.parseUnits("1", "ether"));

        await marketplace.createMarketSale(
            nft.address,
            1,
            { value: ethers.utils.parseUnits("1", "ether") }
        );

        items = await marketplace.fetchAvailableMarketItems();
        expect(items.length).to.equal(1);

        await marketplace.createMarketSale(
            nft.address,
            2,
            { value: ethers.utils.parseUnits("1", "ether") }
        );

        items = await marketplace.fetchAvailableMarketItems();
        expect(items.length).to.equal(0);
    });

    it("Should create vials, transfer them to the payer and send eth to the marketplace", async function () {
        const { marketplace, vialNFT, addr1 } = await deployMarketplaceFixture();

        const vialPrice = ethers.utils.parseEther("0.001")
        await vialNFT.connect(addr1).mintVials("https://www.mytokenURI.com", 10, { value: vialPrice });
        const vials = await vialNFT.connect(addr1).getVialsOwnedByMe();
        expect(vials.length).to.equal(10);
        const marketplaceBalance = await ethers.provider.getBalance(marketplace.address);
        expect(marketplaceBalance).to.equal(vialPrice);
    })

    it("Should create NFTs and return their URIs", async function () {
        const { nft } = await deployMarketplaceFixture();
        // Create NFTs
        await nft.mintToken("https://www.mytokenURI.com");
        await nft.mintToken("https://www.mytokenURI2.com");

        const myTokenIds = await nft.getTokensOwnedByMe();

        const uri_one = await nft.getTokenURI(myTokenIds[0]);
        const uri_two = await nft.getTokenURI(myTokenIds[1]);

        expect(uri_one).to.equal("https://www.mytokenURI.com");
        expect(uri_two).to.equal("https://www.mytokenURI2.com");

        const uris = await nft.getTokenURIs(myTokenIds);
        expect(uris[0]).to.equal("https://www.mytokenURI.com");
        expect(uris[1]).to.equal("https://www.mytokenURI2.com");
    })
});