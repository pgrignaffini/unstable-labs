export type MarketItem = {
    marketItemId: string;
    nftContractAddress: string;
    tokenId: string;
    creator: string;
    seller: string;
    owner: string;
    price: { _hex: string, _isBigNumber: boolean };
    sold: boolean;
    canceled: boolean;
}