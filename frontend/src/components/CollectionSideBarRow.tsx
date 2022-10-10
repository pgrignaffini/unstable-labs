import React from 'react'
import Star from './icons/Star'
import Rocket from './icons/Rocket'
import Nfts from './icons/Nfts'

type Props = {
    title: string
    onClick?: () => void
    type?: "star" | "rocket" | "nfts"
}

function CollectionSideBarRow({ title, onClick, type }: Props) {
    return (
        <div onClick={() => onClick?.()} className="flex max-w-fit items-center space-x-2 px-4 py-3 cursor-pointer hover:border-2 transition-all duration-200 group">
            <p className="hidden text-base font-light md:inline-flex lg:text-xl font-pixel whitespace-nowrap">{title}</p>
            {type === "star" && <Star />}
            {type === "rocket" && <Rocket />}
            {type === "nfts" && <Nfts />}
        </div>
    )
}

export default CollectionSideBarRow