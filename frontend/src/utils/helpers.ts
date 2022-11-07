import type { MarketItem } from "../../typings";
import type { Nft } from "../../typings";
import { create } from 'ipfs-http-client';
import { Vials } from "./vials";


export const parseNftPrice = (nft: Nft & MarketItem) => {
    return parseInt(nft?.price?._hex, 16) / 10 ** 18
}

const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
const projectIdAndSecret = `${projectId}:${projectSecret}`

const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
            'base64'
        )}`,
    },
})

export const groupBy = (items: any[], key: string) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);
