export type MarketItem = {
    marketItemId: string;
    nftContractAddress: string;
    tokenId: string;
    creator: string;
    seller: string;
    owner: string;
    price: string;
    sold: boolean;
    canceled: boolean;
}