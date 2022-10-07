import Link from 'next/link'
import React from 'react'
import ConnectWallet from './ConnectWallet'

function Header() {
    return (
        <div className='flex justify-between items-end py-4 px-8'>
            <div className="flex items-end cursor-pointer group">
                <Link href="/">
                    <a className="font-pixel font-bold text-3xl text-acid">Unstable<span className="text-white">Labs</span></a>
                </Link>
                <div className="group-hover:animate-tremble">
                    <img src="/flask.png" alt="flask" className="w-10" />
                </div>
            </div>
            <Link href="/collections">
                <a className='font-pixel font-xl text-white cursor-pointer'>Collections</a>
            </Link>
            <ConnectWallet />
        </div>
    )
}

export default Header