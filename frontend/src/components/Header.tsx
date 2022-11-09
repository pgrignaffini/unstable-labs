import Link from 'next/link'
import React from 'react'
import ConnectWallet from './ConnectWallet'
import { signIn, signOut, useSession } from "next-auth/react";
import { useAccount, useNetwork } from 'wagmi'

function Header() {

    const { data: session } = useSession();
    const { isConnected, address } = useAccount();

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
            {isConnected && address && !session &&
                <p className="font-pixel font-xl text-white cursor-pointer" onClick={() => signIn("discord")}>
                    Log in
                </p>}
            {session &&
                (<div className="flex space-x-8 items-center">
                    <button className="font-pixel font-xl text-white cursor-pointer" onClick={() => signOut()}>
                        <p>Log out</p>
                    </button>
                    <img src={session?.user?.image as string} className="w-8 h-8" />
                </div>)}
            <ConnectWallet />
        </div>
    )
}

export default Header