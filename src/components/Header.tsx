import React from 'react'
import ConnectWallet from './ConnectWallet'

function Header() {
    return (
        <div className='flex justify-between items-center'>
            <div className="flex items-center cursor-pointer group">
                <p className="font-pixel font-bold text-3xl text-acid">Unstable<span className="text-white">Labs</span></p>
                <div className="group-hover:animate-tremble">
                    <img src="/flask.png" alt="flask" className="w-10" />
                </div>
            </div>
            <p className='font-pixel font-xl text-white cursor-pointer'>Collections</p>
            <ConnectWallet />
        </div>
    )
}

export default Header