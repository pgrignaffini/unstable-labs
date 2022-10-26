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
            ethers.utils.parseUnits("1", "ether"),
            false
        );

        await marketplace.createMarketItem(
            nft.address,
            2,
            ethers.utils.parseUnits("1", "ether"),
            false
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

    it("Should create vials and put them on sale", async function () {
        const { marketplace, vialNFT, owner } = await deployMarketplaceFixture();
        // Create Vials
        await marketplace.connect(owner)
            .createVials("https://www.mytokenURI.com", 10, vialNFT.address);
        const vials = await marketplace.getVialIds();
        expect(vials.length).to.equal(10);
        const vialsForSale = await marketplace.fetchAvailableMarketItems();
        expect(vialsForSale.length).to.equal(10);
    })
});