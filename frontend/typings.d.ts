import { BigNumber } from "ethers";

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

export type RefetchFunction = <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any | undefined, unknown>>

export type GeneratedImage = {
    id: number;
    name: string;
    description: string;
    image: string;
}

export type NftURI = {
    tokenId: BigNumber;
    tokenURI: string;
}

export type Nft = {
    tokenId: BigNumber;
    name: string;
    description: string;
    image: string;
    type: number;
}

export type Vial = {
    tokenId?: BigNumber;
    name: string;
    image: string;
    description: string;
    type: number;
}

export type Generation = {
    img: string,
    model: string,
    seed: string,
    worker_id: string,
    worker_name: string,
}

export type Params = {
    sampler_name: string,
    cfg_scale: number,
    steps: number,
    n: number,
}

export type Status = {
    done: boolean,
    faulted: boolean,
    finished: number,
    processing: number,
    queue_position: number,
    wait_time: number,
    waiting: number,
}

export type Option = {
    value: string,
    label: string,
    prompt: string | undefined,
    params: Params,
    placeholders: Array<string>,
}