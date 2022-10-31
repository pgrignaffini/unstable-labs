import type { NextPage } from "next";
import { useState } from "react";
import Trending from "../components/Trending";
import YourNfts from "../components/YourNfts";
import AvailableNftsOnMarket from "../components/AvailableNftsOnMarket";
import BuyVials from "../components/BuyVials";
import Vials from "../components/Vials";
import dynamic from "next/dynamic";

const CollectionSidebar = dynamic(
    () => import('../components/CollectionSidebar'),
    { ssr: false }
)

const Collections: NextPage = () => {

    const [selectedTab, setSelectedTab] = useState('your-nfts')

    return (
        <div className="grid grid-cols-3 gap-8 p-10 w-4/5 mx-auto min-h-screen">
            <div className="col-span-1">
                <CollectionSidebar setSelectedTab={setSelectedTab} />
            </div>
            {selectedTab === 'trending' && <Trending />}
            {selectedTab === 'your-nfts' && <YourNfts />}
            {selectedTab === 'vials' && <Vials />}
            {selectedTab === 'buy-vials' && <BuyVials />}
            {selectedTab === 'marketplace' && <AvailableNftsOnMarket />}
        </div>
    );
}

export default Collections