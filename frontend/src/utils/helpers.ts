import type { MarketItem } from "../../typings";
import type { Nft } from "alchemy-sdk"

export const parseNftPrice = (nft: Nft & MarketItem) => {
    return parseInt(nft?.price?._hex, 16) / 10 ** 18
}